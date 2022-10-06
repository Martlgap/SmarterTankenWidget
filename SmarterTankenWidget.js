// SmarterTankenWidget - Made with 💙 by Martl

// _________________________________________________
// *CAUTION* Please modify only this segment of code

// Do not remove or replace any "

// Tankerkönig needs an API-Key
// (*) STEP-1: Register at tankerkoenig.de (free)
// (*) STEP-2: Copy-Paste your personal API-Key into the line below
const apiKey = "00000000-0000-0000-0000-000000000000" // <----- * MODIFY THIS *

// Define the location of Gas-Station A (Currently only support for stations in Austria)
const stationA = {
  "country":"austria", // country ("austria" or "germany")
  "latitude":"44.4444", // latitude (decimal value)  // <----- * MODIFY THIS *
  "longitude":"11.1111" // longitude (decimal value)  // <----- * MODIFY THIS *
}

// Define the location Gas-Station B (Currently only support for stations in Germany)
const stationB = {
  "country":"austria", // country ("austria" or "germany")
  "latitude":"44.3333", // latitude (decimal value)  // <----- * MODIFY THIS *
  "longitude":"11.2222" // longitude (decimal value)  // <----- * MODIFY THIS *
}

// Choose your fuel type and modify the line below
const fuelType = "super" // string: ("super" or "diesel")   // <----- * MODIFY THIS *
// _________________________________________________



// *CAUTION* Do not modify anything below this line!
// _________________________________________________

// Set fuelTypes
const fuelTypeLookup = {
    "austria":
    {
    "super":"SUP",
    "diesel":"DIE"
    },
    "germany":
    {
    "super":"e5",
    "diesel":"diesel"
    }
}
stationA["fuelType"] = fuelTypeLookup[stationA.country][fuelType]
stationB["fuelType"] = fuelTypeLookup[stationB.country][fuelType]

// Set widget fuelpump icon 
const pumpIcon = SFSymbol.named("fuelpump.circle")

// Set colors
const symbolColor = Color.orange()
const stationColor = new Color("#9debe3")
const primaryColor = Color.dynamic(Color.black(), Color.white())
const secondaryColor = Color.gray()
const dangerColor = Color.red()
const successColor = Color.green()

// Set fuelTypeString
var fuelTypeStringList = {
    "super":
    [
    SFSymbol.named("s.square"), 
    SFSymbol.named("u.square"),   
    SFSymbol.named("p.square"), 
    SFSymbol.named("e.square"), 
    SFSymbol.named("r.square"),
    SFSymbol.named("e.square"),
    SFSymbol.named("5.square")
    ], 
    "diesel":
    [
    SFSymbol.named("d.square"),   
    SFSymbol.named("i.square"), 
    SFSymbol.named("e.square"), 
    SFSymbol.named("s.square"), 
    SFSymbol.named("e.square"),
    SFSymbol.named("l.square")
    ]
}

// Request method
async function getPriceData(d) {
  try {
    switch(d.country) {
      case "austria": // for austrian gas stations:
        {
        let reqUrl = `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${d.latitude}&longitude=${d.longitude}&fuelType=${d.fuelType}&includeClosed=true`
        let data = await new Request(reqUrl).loadJSON();
        var price = data[0]["prices"][0]["amount"]
        break;
        }
      case "germany": // for german gas stations:
        {
        let reqUrl = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${d.latitude}&lng=${d.longitude}&rad=3&sort=dist&type=${d.fuelType}&apikey=${apiKey}`
        let data = await new Request(reqUrl).loadJSON();
        var price = data["stations"][0]["price"]
        break;
        }
      default:
        return null
    }
    return price
  } catch (e) {
    console.log(e)
    return null
  }
}


// Request gas prices from stations via API request
let priceA = await getPriceData(stationA)
let priceB = await getPriceData(stationB)
let priceDiff = priceB - priceA


// Create the widget
let widget = await createWidget();
if (!config.runsInWidget) {
  await widget.presentSmall();
}

// Run the widget
Script.setWidget(widget);
Script.complete();


// Design of the widget
async function createWidget(items) {
  const widget = new ListWidget();
  widget.setPadding(2, 1, 1, 1) // padding
  
  // Get refresh date
  let date = new Date(Date.now());

  // Cache data for at least 5 minutes
  widget.refreshAfterDate = new Date(Date.now() + 300000);
  
  // Design is build with Stacks
  const frame = widget.addStack();
  frame.layoutVertically();
  frame.addSpacer(1)
  {
    const row = frame.addStack();
    row.layoutHorizontally();
    row.addSpacer(6)
    {
      const col = row.addStack();
      col.layoutVertically();
      {
        let pump = col.addImage(pumpIcon.image)
        pump.tintColor = symbolColor
        pump.imageSize = new Size(45, 45)
        col.addSpacer(4)
        let txt = col.addText("Savings:")
        txt.textColor = primaryColor
        txt.font = Font.mediumSystemFont(11)
      }
      row.addSpacer(0)
    }  
    const col = row.addStack();
    col.layoutVertically();
    {
      let txt = col.addText("Smart Tanken")
      txt.textColor = symbolColor
      txt.font = Font.mediumSystemFont(13)
      const row = col.addStack();
      row.layoutHorizontally();
      row.topAlignContent()
      row.addSpacer(16)
      {
        let price = row.addText((priceDiff*100).toFixed(0))
        price.textColor = (priceDiff >= 0) ? successColor : dangerColor
        price.font = (priceDiff >= 0) ? Font.mediumSystemFont(45) : Font.mediumSystemFont(33)
      }
      let currency = row.addText("ct")
      currency.textColor = primaryColor
      currency.font = Font.mediumSystemFont(12)
    }
  }
  frame.addSpacer(3)
  {
    const row = frame.addStack()
    row.layoutHorizontally();
    row.addSpacer((fuelType == "super") ? 17 : 20)
    {
      for (let i = 0; i < fuelTypeStringList[fuelType].length; i++) {
        let icon = row.addImage(fuelTypeStringList[fuelType][i].image)
        icon.tintColor = (i > 4 && fuelType == "super") ? dangerColor : secondaryColor
        icon.imageSize = new Size(16, 16)
        if (i == 4 && fuelType == "super") {
          row.addSpacer(4)
        }
      }
    }
  }
  frame.addSpacer(3)
  {
    const row = frame.addStack();
    row.layoutHorizontally();
    row.addSpacer(1)
    {
      const col = row.addStack();
      col.layoutVertically();
      const station = col.addText("  " + stationA.country.charAt(0).toUpperCase() + stationA.country.slice(1) + ":")
      station.font = Font.mediumSystemFont(12);
      station.textColor = stationColor
      let price = col.addText("    " + priceA.toFixed(2) + "€")
      price.textColor = primaryColor
      price.font = Font.mediumSystemFont(12)
    }
    row.addSpacer(26)
    {
      const col = row.addStack();
      col.layoutVertically();
      const station = col.addText("  " + stationB.country.charAt(0).toUpperCase() + stationB.country.slice(1) + ":")
      station.font = Font.mediumSystemFont(12);
      station.textColor = stationColor
      let price = col.addText("   " + priceB.toFixed(2) + "€")
      price.textColor = primaryColor
      price.font = Font.mediumSystemFont(12)
    }
    row.addSpacer(1)
  }
  frame.addSpacer(7)
  {
    let row = frame.addStack();
    row.layoutHorizontally();
    row.addSpacer(31)
    txt = row.addText(`${('' + date.getDate()).padStart(2, '0')}.${('' + (date.getMonth() + 1)).padStart(2, '0')}.${date.getFullYear()} ${('' + date.getHours()).padStart(2, '0')}:${('' + date.getMinutes()).padStart(2, '0')}`)
    txt.textColor = secondaryColor
    txt.font = Font.mediumSystemFont(9)
    row.addSpacer(36)
  }
  return widget
}
