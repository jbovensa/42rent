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
      return System.Configuration.ConfigurationSettings.AppSettings["BoardConnectionString"];
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

    public static async Task<bool> InsertImmobileNoticeAsync(string language, ImmobileNotice notice)
    {
      using (SqlConnection conn = new SqlConnection(getBoardConnectionString()))
      {
        var reader = await execStoredProcAsync("InsertNotice", conn,
          "Language", language,
          "Title", notice.Title,
          "Price_Amount", notice.Price.Amount,
          "Price_Currency", notice.Price.Currency,
          "DistrictID", (notice.District != null) ? notice.District.DistrictID : (int?)null,
          "CityID", (notice.City != null) ? notice.City.CityID : (int?)null
          );
      }
      return true;
    }
  }
}
