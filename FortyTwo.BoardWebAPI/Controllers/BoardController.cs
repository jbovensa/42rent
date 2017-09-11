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
      var districts = await BoardDAL.GetDistrictsAsync(language);
      return districts;
    }

    [HttpPost]
    public async Task<IEnumerable<City>> GetCities(string language, District district)
    {
      var cities = await BoardDAL.GetCitiesAsync(language, district);
      return cities;
    }

    [HttpPost]
    public async Task<IEnumerable<Neighborhood>> GetNeighborhoods(string language, City city)
    {
      var neighborhoods = await BoardDAL.GetNeighborhoodsAsync(language, city);
      return neighborhoods;
    }

    [HttpPost]
    public async Task<IEnumerable<Street>> GetStreets(string language, City city)
    {
      var streets = await BoardDAL.GetStreetsAsync(language, city);
      return streets;
    }

    public async Task<District> GetDistrictByName(string language, string name)
    {
      return await BoardDAL.GetDistrictByNameAsync(language, name);
    }

    public async Task<City> GetCityByName(string language, string name)
    {
      return await BoardDAL.GetCityByNameAsync(language, name);
    }

    public async Task<Neighborhood> GetNeighborhoodByName(string language, string name)
    {
      return await BoardDAL.GetNeighborhoodByNameAsync(language, name);
    }

    public async Task<Street> GetStreetByName(string language, string name)
    {
      return await BoardDAL.GetStreetByNameAsync(language, name);
    }

    public async Task<IEnumerable<PropertyType>> GetPropertyTypes(string language)
    {
      var propertyTypes = await BoardDAL.GetPropertyTypesAsync(language);
      return propertyTypes;
    }

    public async Task<PropertyType> GetPropertyTypeByName(string language, string name)
    {
      return await BoardDAL.GetPropertyTypeByNameAsync(language, name);
    }

    public async Task<IEnumerable<Currency>> GetCurrencies()
    {
      var currencies = await BoardDAL.GetCurrenciesAsync();
      return currencies;
    }

    public async Task<Currency> GetCurrencyBySymbol(string symbol)
    {
      return await BoardDAL.GetCurrencyBySymbolAsync(symbol);
    }
  }
}
