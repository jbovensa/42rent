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
    public async Task<int> SuggestDistrict(string language, District district)
    {
      return await BoardDAL.InsertDistrictAsync(language, district);
    }
    public async Task<int> SuggestCity(string language, City city)
    {
      return await BoardDAL.InsertCityAsync(language, city);
    }
    public async Task<int> SuggestNeighborhood(string language, Neighborhood neighborhood)
    {
      return await BoardDAL.InsertNeighborhoodAsync(language, neighborhood);
    }
    public async Task<int> SuggestStreet(string language, Street street)
    {
      return await BoardDAL.InsertStreetAsync(language, street);
    }

    public async Task<bool> PostImmobileNotice(ImmobileNotice notice, string language = null)
    {
      if (!notice.Address.District.DistrictID.HasValue && notice.Address.District.Name != null)
      {
        var districtID = await BoardDAL.InsertDistrictAsync(language, notice.Address.District);
        notice.Address.District.DistrictID = districtID;
        notice.Address.City.District = new District() { DistrictID = districtID };

        var cityID = await BoardDAL.InsertCityAsync(language, notice.Address.City);
        notice.Address.City.CityID = cityID;
      }
      else
        notice.Address.City.District = new District() { DistrictID = notice.Address.District.DistrictID };

      if (!notice.Address.City.CityID.HasValue && notice.Address.City.Name != null)
      {
        await BoardDAL.InsertCityAsync(language, notice.Address.City);
      }

      await Validation.ValidateAddressAsync(notice.Address);

      return await BoardDAL.InsertImmobileNoticeAsync(notice, language);
    }
  }
}
