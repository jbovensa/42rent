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
    public async Task<bool> InsertImmobileNotice(string language, ImmobileNotice notice)
    {
      return await BoardDAL.InsertImmobileNoticeAsync(language, notice);
    }
  }
}
