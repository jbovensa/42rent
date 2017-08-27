using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using FortyTwo.Board;
using FortyTwo.Board.Models;

namespace FortyTwo.BoardWebAPI.Controllers
{
  public class BoardController : ApiController
  {
    public async Task<IEnumerable<District>> GetDistricts(string language)
    {
      return await BoardDAL.GetDistrictsAsync(language);
    }

    [HttpPost]
    public async Task<IEnumerable<City>> GetCities(string language, District district)
    {
      var cities = await BoardDAL.GetCitiesAsync(language, district);

      // Get a manageable amount of large cities
      var minPopulation = 5000;
      while (cities.Count() > 100) {
        cities = cities.Where(c => c.Population > minPopulation);
        minPopulation += 5000;
      }

      return cities;
    }
  }
}
