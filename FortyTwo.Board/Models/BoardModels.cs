﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FortyTwo.Board.Models
{
  public class District
  {
    public int DistrictID { get; set; }
    public string Name { get; set; }
  }

  public class City
  {
    public int CityID { get; set; }
    public District District { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; }
    public int Population { get; set; }
  }

  public class Neighborhood
  {
    public int NeighborhoodID { get; set; }
    public City City { get; set; }
    public string Name { get; set; }
  }

  public class Price
  {
    public float Amount { get; set; }
    public string Currency { get; set; }
  }

  public class Notice
  {
    public int NoticeID { get; set; }
    public Price Price { get; set; }
    public string Title { get; set; }
  }

  public class ImmobileNotice : Notice
  {
    public District District { get; set; }
    public City City { get; set; }
    public Neighborhood Neighborhood { get; set; }
  }
}
