const apiKey = "0000000000000-00000000-0000-0000-000000000" // Tankerkönig needs API-Key (Register at tankerkoenig.de)
const lat_aut = "44.4444" // Enter Latitute of Station1 here
const long_aut = "9.9999" // Enter Longitude of Station2 here
const lat_de = "44.6666666" 
const long_de = "9.3333"
const fuelType_de = "e5"
const fuelType_str = ""
const fuelType_aut = "SUP"


const pumpIcon = SFSymbol.named("fuelpump.circle")
const fuelIcon1 = SFSymbol.named("s.square")
const fuelIcon2 = SFSymbol.named("u.square")
const fuelIcon3 = SFSymbol.named("p.square")
const fuelIcon4 = SFSymbol.named("e.square")
const fuelIcon5 = SFSymbol.named("r.square")
const fuelIcon6 = SFSymbol.named("e.square")
const fuelIcon7 = SFSymbol.named("5.square")


const symbolColor = Color.orange()
const stationColor = new Color("#9debe3")



// Request DE price:
async function getPriceData_de() {
  try {
    const reqUrl_de = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${lat_de}&lng=${long_de}&rad=3&sort=dist&type=${fuelType_de}&apikey=${apiKey}`
    let data_de = await new Request(reqUrl_de).loadJSON();
    let price_de = data_de["stations"][0]["price"]
    return price_de
  } catch (e) {
    console.log(e)
    return null
  }
}

// Request AUT price:
async function getPriceData_aut() {
  try {
    const reqUrl_at = `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${lat_aut}&longitude=${long_aut}&fuelType=${fuelType_aut}&includeClosed=true`
    let data_aut = await new Request(reqUrl_at).loadJSON();
    let price_aut = data_aut[0]["prices"][0]["amount"]
    return price_aut
  } catch (e) {
    console.log(e)
    return null
  }
}

// Request Data
let price_de = await getPriceData_de()
let price_aut = await getPriceData_aut()
let price_diff = price_de - price_aut

function capitalize(string) {
  return string.toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}


let widget = await createWidget();
if (!config.runsInWidget) {
  await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();


// Widget Function
async function createWidget(items) {
  const widget = new ListWidget();
  widget.setPadding(2, 1, 1, 1)
  
  // Get refresh date
  let date = new Date(Date.now());

  // cache data for at least 5 minutes
  widget.refreshAfterDate = new Date(Date.now() + 300000);
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
      txt.textColor = Color.white()
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
          let price = row.addText((price_diff*100).toFixed(0))
          price.textColor = (price_diff >= 0) ? Color.green() : Color.red()
          price.font = (price_diff >= 0) ? Font.mediumSystemFont(45) : Font.mediumSystemFont(33)
        }
      
      let currency = row.addText("ct")
          currency.textColor = Color.white()
          currency.font = Font.mediumSystemFont(12)
    }
  }
  
  frame.addSpacer(3)
  {
    const row = frame.addStack()
    row.layoutHorizontally();
    row.addSpacer(17)
    {
    {
    let icon = row.addImage(fuelIcon1.image)
      icon.tintColor = Color.gray()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    {
    let icon = row.addImage(fuelIcon2.image)
      icon.tintColor = Color.gray()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    {
    let icon = row.addImage(fuelIcon3.image)
      icon.tintColor = Color.gray()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    {
    let icon = row.addImage(fuelIcon4.image)
      icon.tintColor = Color.gray()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    {
    let icon = row.addImage(fuelIcon5.image)
      icon.tintColor = Color.gray()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(3)
    }
    {
    let icon = row.addImage(fuelIcon6.image)
      icon.tintColor = Color.white()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    {
    let icon = row.addImage(fuelIcon7.image)
      icon.tintColor = Color.white()
      icon.imageSize = new Size(16, 16)
      row.addSpacer(0)
    }
    }
  }
  frame.addSpacer(3)
  {
    const row = frame.addStack();
    row.layoutHorizontally();
    {
      row.addSpacer(1)
      {
      const col = row.addStack();
      col.layoutVertically();
      
      const station = col.addText("  Austria:")
      station.font = Font.mediumSystemFont(12);
      station.textColor = stationColor
 
      let price = col.addText("    " + price_aut.toFixed(2) + "€")
      price.textColor = Color.white()
      price.font = Font.mediumSystemFont(12)
      }
      
      row.addSpacer(28)
      {
      const col = row.addStack();
      col.layoutVertically();
      
      const station = col.addText("Germany:")
      station.font = Font.mediumSystemFont(12);
      station.textColor = stationColor
 
      let price = col.addText("   " + price_de.toFixed(2) + "€")
      price.textColor = Color.white()
      price.font = Font.mediumSystemFont(12)
      
      }
      row.addSpacer(1)
    }
   }
  {
  frame.addSpacer(7)
  let row = frame.addStack();
  row.layoutHorizontally();
  row.addSpacer(31)
  txt = row.addText(`${('' + date.getDate()).padStart(2, '0')}.${('' + (date.getMonth() + 1)).padStart(2, '0')}.${date.getFullYear()} ${('' + date.getHours()).padStart(2, '0')}:${('' + date.getMinutes()).padStart(2, '0')}`)
  txt.textColor = Color.gray()
  txt.font = Font.mediumSystemFont(9)
  row.addSpacer(36)
  }
  return widget
}
