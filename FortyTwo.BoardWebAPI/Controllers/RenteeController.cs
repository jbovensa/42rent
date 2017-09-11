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
      if (notice.Address.District.Name != null)
      {
        // New district
        var districtID = await BoardDAL.InsertDistrictAsync(language, notice.Address.District);
        notice.Address.District.DistrictID = districtID;
        notice.Address.City.District = new District() { DistrictID = districtID };

        var cityID = await BoardDAL.InsertCityAsync(language, notice.Address.City);
        notice.Address.City.CityID = cityID;
      }
      else
        // Existing district
        notice.Address.City.District = new District() { DistrictID = notice.Address.District.DistrictID };

      if (notice.Address.City.Name != null)
      {
        // New city
        var cityID = await BoardDAL.InsertCityAsync(language, notice.Address.City);
        notice.Address.City.CityID = cityID;
        notice.Address.Neighborhood.City = new City() { CityID = cityID };
        notice.Address.Street.City = new City { CityID = cityID };
      }
      else
      {
        // Existing city
        notice.Address.Neighborhood.City = new City { CityID = notice.Address.City.CityID };
        notice.Address.Street.City = new City { CityID = notice.Address.City.CityID };
      }

      if (notice.Address.Neighborhood.Name != null)
      {
        // New neighborhood
        var neighborhoodID = await BoardDAL.InsertNeighborhoodAsync(language, notice.Address.Neighborhood);
        notice.Address.Neighborhood.NeighborhoodID = neighborhoodID;
      }

      if (notice.Address.Street.Name != null)
      {
        // New street
        var streetID = await BoardDAL.InsertStreetAsync(language, notice.Address.Street);
        notice.Address.Street.StreetID = streetID;
      }

      if (notice.PropertyType.Name != null)
      {
        // New propertyType
        var propertyTypeID = await BoardDAL.InsertPropertyTypeAsync(language, notice.PropertyType);
        notice.PropertyType.PropertyTypeID = propertyTypeID;
      }

      if (notice.Price.Currency.Symbol != null)
      {
        // New currency
        var currencyID = await BoardDAL.InsertCurrencyAsync(notice.Price.Currency);
        notice.Price.Currency.CurrencyID = currencyID;
      }

      return await BoardDAL.InsertImmobileNoticeAsync(notice, language);
    }
  }
}
