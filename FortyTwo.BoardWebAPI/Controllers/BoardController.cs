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
  }
}
