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
  public class RenteeController : ApiController
  {
    public async Task<bool> SuggestDistrict(string language, District district)
    {
      return await BoardDAL.InsertDistrictAsync(language, district);
    }
    public async Task<bool> SuggestCity(string language, City city)
    {
      return await BoardDAL.InsertCityAsync(language, city);
    }
    public async Task<bool> SuggestNeighborhood(string language, Neighborhood neighborhood)
    {
      return await BoardDAL.InsertNeighborhoodAsync(language, neighborhood);
    }
    public async Task<bool> SuggestStreet(string language, Street street)
    {
      return await BoardDAL.InsertStreetAsync(language, street);
    }

    public async Task<bool> PostImmobileNotice(ImmobileNotice notice, string language = null)
    {
      await Validation.ValidateAddressAsync(notice.Address);
      return await BoardDAL.InsertImmobileNoticeAsync(notice, language);
    }
  }
}
