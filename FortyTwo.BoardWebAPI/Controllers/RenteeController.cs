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
      int districtID;
      if (!notice.Address.District.DistrictID.HasValue)
        districtID = await BoardDAL.InsertDistrictAsync(language, notice.Address.District);
      else
        districtID = notice.Address.District.DistrictID.Value;

      if (!notice.Address.City.CityID.HasValue)
      {
        notice.Address.City.District = new District() { DistrictID = districtID };
        await BoardDAL.InsertCityAsync(language, notice.Address.City);
      }

      await Validation.ValidateAddressAsync(notice.Address);

      return await BoardDAL.InsertImmobileNoticeAsync(notice, language);
    }
  }
}
