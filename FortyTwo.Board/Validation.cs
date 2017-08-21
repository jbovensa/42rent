using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FortyTwo.Board.Models;

namespace FortyTwo.Board
{
  public class Validation
  {
    public async static Task ValidateAddressAsync(Address address)
    {
      if (address == null)
        return;

      //Keep only the most specific address specifier
      if (address.Street != null && address.Street.StreetID.HasValue)
      {
        if (address.Neighborhood != null && address.Neighborhood.NeighborhoodID.HasValue)
        {
          address.Street = await BoardDAL.GetStreetAsync(null, address.Street.StreetID.Value);
          address.Neighborhood = await BoardDAL.GetNeighborhoodAsync(null, address.Neighborhood.NeighborhoodID.Value);

          // Street and neighborhood cities don't match
          if (address.Street.City.CityID != address.Neighborhood.City.CityID)
          {
            address.Neighborhood = null;
          }
        }
        address.City = null;
        address.District = null;
      }
      if (address.Neighborhood != null && address.Neighborhood.NeighborhoodID.HasValue)
      {
        address.City = null;
        address.District = null;
      }
      if (address.City != null && address.City.CityID.HasValue)
      {
        address.District = null;
      }
    }
  }
}
