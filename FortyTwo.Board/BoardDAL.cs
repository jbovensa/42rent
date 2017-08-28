using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FortyTwo.Board.Models;
using System.Data.SqlClient;
using System.Data;

namespace FortyTwo.Board
{
  public class BoardDAL
  {
    private static string getBoardConnectionString()
    {
      return System.Configuration.ConfigurationManager.AppSettings["BoardConnectionString"];
    }
    private static int? getNumSuggestionsThreshold()
    {
      var value = System.Configuration.ConfigurationManager.AppSettings["NumSuggestionsThreshold"];
      return (!string.IsNullOrWhiteSpace(value)) ? int.Parse(value) : (int?)null;
    }

    private static async Task<SqlDataReader> execStoredProcAsync(string procName, SqlConnection conn, params object[] parameters)
    {
      SqlCommand cmd = new SqlCommand(procName, conn);
      cmd.CommandType = CommandType.StoredProcedure;
      for (int n = 0; (2 * n) < parameters.Length; n++)
        cmd.Parameters.AddWithValue(parameters[2 * n].ToString(), parameters[2 * n + 1]);
      await conn.OpenAsync();
      return await cmd.ExecuteReaderAsync();
    }


    public static async Task<bool> InsertDistrictAsync(string language, District district)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("SuggestDistrict", conn,
          "Language", language,
          "Name", district.Name
          );
      }
      return true;
    }

    public static async Task<bool> InsertCityAsync(string language, City city)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("SuggestCity", conn,
          "Language", language,
          "DistrictID", (city.District != null) ? city.District.DistrictID : (int?)null,
          "Name", city.Name
          );
      }
      return true;
    }

    public static async Task<bool> InsertNeighborhoodAsync(string language, Neighborhood neighborhood)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("SuggestNeighborhood", conn,
          "Language", language,
          "CityID", (neighborhood.City != null) ? neighborhood.City.CityID : (int?)null,
          "Name", neighborhood.Name
          );
      }
      return true;
    }

    public static async Task<bool> InsertStreetAsync(string language, Street street)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("SuggestStreet", conn,
          "Language", language,
          "CityID", (street.City != null) ? street.City.CityID : (int?)null,
          "Name", street.Name
          );
      }
      return true;
    }


    public static async Task<IEnumerable<District>> GetDistrictsAsync(string language)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("GetDistricts", conn,
          "Language", language,
          "NumSuggestionsThreshold", getNumSuggestionsThreshold()
          );

        var districts = new List<District>();
        while (reader.Read())
        {
          var district = new District()
          {
            DistrictID = (int?)reader["DistrictID"],
            Name = (reader["Name"] != DBNull.Value) ? (string)reader["Name"] : null
          };
          districts.Add(district);
        }
        return districts;
      }
    }

    public static async Task<IEnumerable<City>> GetCitiesAsync(string language, District district = null)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("GetCities", conn,
          "Language", language,
          "DistrictID", (district != null) ? district.DistrictID : (int?)null,
          "NumSuggestionsThreshold", getNumSuggestionsThreshold()
          );

        var cities = new List<City>();
        while (reader.Read())
        {
          var city = new City()
          {
            CityID = (int?)reader["CityID"],
            Symbol = (string)reader["Symbol"],
            District = (reader["DistrictID"] != DBNull.Value) ? new District() { DistrictID = (int?)reader["DistrictID"] } : null,
            Population = (int)reader["Population"],
            Name = (reader["Name"] != DBNull.Value) ? (string)reader["Name"] : null
          };
          cities.Add(city);
        }
        return cities;
      }
    }

    public static async Task<IEnumerable<Neighborhood>> GetNeighborhoodsAsync(string language, City city)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("GetNeighborhoods", conn,
          "Language", language,
          "CityID", city.CityID,
          "NumSuggestionsThreshold", getNumSuggestionsThreshold()
          );

        var neighborhoods = new List<Neighborhood>();
        while (reader.Read())
        {
          var neighborhood = new Neighborhood()
          {
            NeighborhoodID = (int?)reader["NeighborhoodID"],
            City = (reader["CityID"] != DBNull.Value) ? new City() { CityID = (int?)reader["CityID"] } : null,
            Name = (reader["Name"] != DBNull.Value) ? (string)reader["Name"] : null
          };
          neighborhoods.Add(neighborhood);
        }
        return neighborhoods;
      }
    }

    public static async Task<Street> GetStreetAsync(int streetID, string language = null)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("GetStreet", conn,
          "Language", language,
          "StreetID", streetID
          );

        reader.Read();
        return new Street()
        {
          StreetID = (int?)reader["StreetID"],
          City = new City()
          {
            CityID = (int?)reader["CityID"]
          },
          Name = (reader["Name"] != DBNull.Value) ? (string)reader["Name"] : null
        };
      }
    }

    public static async Task<Neighborhood> GetNeighborhoodAsync(int neighborhoodID, string language = null)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("GetNeighborhood", conn,
          "Language", language,
          "NeighborhoodID", neighborhoodID
          );

        reader.Read();
        return new Neighborhood()
        {
          NeighborhoodID = (int?)reader["NeighborhoodID"],
          City = new City()
          {
            CityID = (int?)reader["CityID"]
          },
          Name = (reader["Name"] != DBNull.Value) ? (string)reader["Name"] : null
        };
      }
    }


    public static async Task<bool> InsertImmobileNoticeAsync(ImmobileNotice notice, string language = null)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("InsertNotice", conn,
          "Language", language,
          "Title", notice.Title,
          "Price_Amount", (notice.Price != null) ? notice.Price.Amount : (float?)null,
          "Price_Currency", (notice.Price != null) ? notice.Price.Currency : null,
          "Address_DistrictID", (notice.Address != null) ? ((notice.Address.District != null) ? notice.Address.District.DistrictID : (int?)null) : null,
          "Address_CityID", (notice.Address != null) ? ((notice.Address.City != null) ? notice.Address.City.CityID : (int?)null) : null,
          "Address_NeighborhoodID", (notice.Address != null) ? ((notice.Address.Neighborhood != null) ? notice.Address.Neighborhood.NeighborhoodID : (int?)null) : null,
          "Address_StreetID", (notice.Address != null) ? ((notice.Address.Street != null) ? notice.Address.Street.StreetID : (int?)null) : null,
          "Address_BuildingNumber", (notice.Address != null) ? notice.Address.BuildingNumber : null,
          "Address_ApartmentNumber", (notice.Address != null) ? notice.Address.ApartmentNumber : null,
          "PropertyTypeID", (notice.PropertyType != null) ? notice.PropertyType.PropertyTypeID : null
          );
      }
      return true;
    }
  }
}
