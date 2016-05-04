
import CategoryColors from './CategoryColors.js';

class Tips extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    getIcon(cat) {
      return CategoryColors.categories[cat].icon
    }

    render() {
        return <div>
          {(()=>{
            if (this.props.name == "Info") {
              return <div>
                <h3>About</h3>
                <p>Based World is an interface to view current natural disasters and their effects.</p>
                <p>View tweets and see the general mood people have about current natural events.</p>
                <p>Using our Neural Network map, educate yourself on how to prepare for a natural event depending on the region you live in.</p>
                <h3>Github</h3>
                <p><a href="https://github.com/qwook/3rdRock/">Click here to view our source code.</a></p>
                <h3>Data Displayed</h3>
                <p>Due to API limitations, we are not able to render data in real time. Instead, we display a snapshot of data from April 27th.</p>
                <p>You may, however, generate more current data using our source code. You will need to supply your own API keys for each individual API.</p>
                <hr />
                <h3>Icons</h3>
                <p>Volcano by Sergey Demushkin from the Noun Project</p>
                <p>Fire by Mike Ashley from the Noun Project</p>
                <p>drop by Dolly Vu from the Noun Project</p>
                <p>fast by irene hoffman from the Noun Project</p>
                <p>Falling Rocks by Daniele Catalanotto from the Noun Project</p>
                <p>Iceberg by Juan Pablo Bravo from the Noun Project</p>
                <p>Earthquake by Daniele Catalanotto from the Noun Project</p>
              </div>
            } else {
              return <div>
              <img src={this.getIcon(this.props.name)} style={{display: 'inlineBlock', height: '32px'}}/>
              {(()=>{
                if (this.props.name == "Wildfires") {
                  return <div>
                    <h2>Wildfires</h2>
                      <p>Lop off dead branches over the roof of a house and within 10 feet of a chimney.</p>
                      <p>Move firewood piles away from all structures.</p>
                      <p>Prune the branches of taller trees to six feet above the ground so that a ground fire cannot climb into the crown of the trees.</p>
                      <p>No matter how attractive they look, never cover a roof with wooden cedar shingles. Fiery brands and ash often precede a wildfire and can ignite a wooden roof miles from the main fire.</p>
                      <p>Enclose the underside of porches and decks to keep fire from creeping under the house.</p>
                      <p>Clearly mark all water sources on your property so firefighters can easily get to them.</p>
                      <p>Be aware that firefighters may avoid homes where the driveway provides no turnaround for fire engines, homes on roads with light bridges that won't carry heavy, water-laden trucks, and homes at the heads of forested draws</p>
                  </div>
                } else if (this.props.name == "Volcanoes") {
                  return <div>
                    <h2>Volcanoes</h2>
                    <h5>If a lava flow is headed toward you:</h5>
                      <p>Leave the area immediately. If you are warned to evacuate because an eruption is imminent, evacuate.</p>
                      <p>If you can drive rather than walk, use your vehicle to evacuate. When driving keep doors and windows closed, drive across the path of danger if you can or away from the danger if you can not, and watch for unusual hazards in the road.</p>
                    <h5>If you are indoors</h5>
                      <p>Close all windows, doors, and fireplace or woodstove dampers.</p>
                      <p>Turn off all fans and heating and air conditioning systems.</p>
                      <p>Bring pets and livestock into closed shelters.</p>
                    <h5>If you are outdoors</h5>
                      <p>Seek shelter indoors.</p>
                      <p>If caught in a rockfall, roll into a ball to protect your head.</p>
                      <p>If near a stream or river, be aware of rising water and possible mudflows in low-lying areas. Move up-slope as quickly as possible.</p>
                      <p>Seek care for burns right away. Immediate care can be life saving.</p>
                      <p>Stay inside, if possible, with windows and doors closed.</p>
                      <p>Wear long-sleeved shirts and long pants.</p>
                      <p>Use goggles to protect your eyes.</p>
                      <p>Keep your car or truck engine switched off.</p>
                  </div>
                } else if (this.props.name == "Dust and Haze") {
                  return <div>
                    <h2>Dust & Haze</h2>
                      <p>Stay Indoors</p>
                      <p>Avoid Heavy Outdoor Activities</p>
                      <p>Wear A N95 Mask</p>
                      <p>Increase Fiber Intake</p>
                      <p>Take Medication To Alleviate Symptoms</p>
                      <p>Stop Smoking</p>
                      <p>Pay Attention To Air Quality Updates</p>
                      <p>Stay Hydrated</p>
                  </div>
                } else if (this.props.name == "Drought") {
                  return <div>
                    <h2>Drought</h2>
                      <h5>Indoors</h5>
                        <p>Use washing machines for full loads only.</p>
                        <p>Run the dishwasher only when full.</p>
                        <p>When washing dishes by hand, don’t let the water run. Fill one basin with wash water and the other with rinse water.</p>
                        <p>Install an aerator on your kitchen faucet to reduce flow to less than 1 gallon per minute.</p>
                        <p>Use the garbage disposal sparingly. Alternatively, you can compost vegetable food waste and save gallons of water every time.</p>
                        <p>Install low-flow shower heads.</p>
                        <p>Take a five minute shower instead of a 10 minute one.</p>
                        <p>Turn your bathroom faucet off when brushing your teeth or shaving.</p>
                      <h5>Outdoors</h5>
                        <p>Water early in the morning or later in the evening when temperatures are cooler.</p>
                        <p>Adjust your sprinklers to ensure only your yard is being watered, not your house, sidewalk or street.</p>
                        <p>Put a layer of mulch around trees and plants to reduce evaporation and keep the soil cool.</p>
                        <p>Landscape your yard with climate appropriate plants.</p>
                        <p>Use a broom instead of a hose to clean driveways, sidewalks and patios.</p>
                        <p>Wash vehicles with a bucket and sponge, and make sure your hose has a self-closing nozzle.</p>
                  </div>
                } else if (this.props.name == "Earthquakes") {
                  return <div>
                    <h2>Earthquakes</h2>
                      <p>Fasten shelves securely to walls, and place heavy objects on lower shelves.</p>
                      <p>Store breakable items in low, closed cabinets.</p>
                      <p>Hang items such as pictures and mirrors away from beds and anywhere people sit.</p>
                      <p>Brace hanging light fixtures.</p>
                      <p>Repair known defective electrical wiring and gas connections.</p>
                      <p>Strap your water heater to studs in the wall and bolt it to the floor.</p>
                      <p>Repair any large existing cracks in walls or foundations.</p>
                      <p>Store poisons such as pesticides and herbicides, as well as flammable liquids, on bottoms shelves of latched cabinets.</p>
                      <p>Identify safe places in each room (under sturdy furniture, against inside walls, away from glass).</p>
                  </div>
                } else if (this.props.name == "Landslides") {
                  return <div>
                    <h2>Landslides</h2>
                      <p>To begin preparing, you should build an emergency kit and make a family communications plan.</p>
                      <p>Prepare for landslides by following proper land-use procedures - avoid building near steep slopes, close to mountain edges, near drainage ways or along natural erosion valleys.</p>
                      <p>Become familiar with the land around you. Learn whether debris flows have occurred in your area by contacting local officials. Slopes where debris flows have occurred in the past are likely to experience them in the future.</p>
                      <p>Get a ground assessment of your property.</p>
                      <p>Consult a professional for advice on appropriate preventative measures for your home or business, such as flexible pipe fittings, which can better resist breakage.</p>
                      <p>Protect your property by planting ground cover on slopes and building retaining walls.</p>
                      <p>In mudflow areas, build channels or deflection walls to direct the flow around buildings. Be aware, however, if you build walls to divert debris flow and the flow lands on a neighbor's property, you may be liable for damages.</p>
                      <p>If you are at risk from a landslide talk to your insurance agent. Debris flow may be covered by flood insurance policies from the National Flood Insurance Program (NFIP).</p>
                      <p></p>
                      <p></p>
                  </div>
                } else if (this.props.name == "Sea and Lake Ice") {
                  return <div>
                    <h2>Iceberg</h2>
                      <p>Don't be Titanic</p>
                  </div>
                } else if (this.props.name == "Severe Storms") {
                  return <div>
                    <h2>Severe Storms</h2>
                      <p>Trim dead branches and cut down dead trees to reduce the danger of these falling onto your house during a storm.</p>
                      <p>Clean gutters, drains and downpipes.</p>
                      <p>Make sure your roof is in good repair.</p>
                      <p>Prepare an emergency kit.</p>
                      <p>When a storm is imminent</p>
                      <p>Always check the weather forecast before heading out on the water. Do not go boating in a storm. If you are on the water and see bad weather approaching, head for shore immediately. Remember to file a sail plan with a responsible person, and frequently monitor the VHF marine or Weatheradio broadcast throughout your trip.</p>
                      <p>Secure everything that might be blown around or torn loose – indoors and outdoors. Flying objects such as garbage cans and lawn furniture can injure people and damage property.</p>
                      <p>Consider going to the sheltered area that you and your family identified in your emergency plan.</p>
                  </div>
                } else if (this.props.name == "Temperature Extremes") {
                  return <div>
                    <h2>Temperature Extremes</h2>
                      <p>Build a disaster supply kit and make a family plan</p>
                      <p>If installing window air conditioners, install them snugly and insulate if necessary</p>
                      <p>Check air-conditioning ducts for proper insulation</p>
                      <p>Install temporary window reflectors (for use between windows and drapes), such as aluminum foil-covered cardboard, to reflect heat back outside</p>
                      <p>Weather-strip doors and sills to keep cool air in</p>
                      <p>Cover windows that receive morning or afternoon sun with drapes, shades, awnings, or louvers—outdoor awnings or louvers can reduce the heat that enters a home by up to 80 percent</p>
                      <p>Listen to local weather forecasts and stay aware of upcoming temperature changes</p>
                      <p>Know those in your neighborhood who are elderly, young, or in poor health—they are more likely to become victims of excessive heat and may need help</p>
                      <p>Be aware that people living in urban areas may be at greater risk from the effects of a prolonged heat wave than are people living in rural areas</p>
                      <p>Get trained in first aid to learn how to treat heat-related emergencies</p>
                  </div>
                } else if (this.props.name == "Water Color") {
                  return <div>
                    <h2>Water Colors</h2>
                      <p>Avoid adding pollutants to ocean</p>
                  </div>
                } else if (this.props.name == "Floods") {
                  return <div>
                    <h2>Floods</h2>
                      <p>Avoid building in high-risk flood plain areas to minimize your exposure.</p>
                      <p>Elevate your furnace, water heater and other utilities so that they are less likely to be affected in a flood.</p>
                      <p>Consider installing “check valves” to prevent water from backing up into your house during a flood.</p>
                      <p>Seal your basement walls with waterproof material to help protect your home.</p>
                      <p>Pay attention to local news and information sources when the weather is a potential issue.</p>
                      <p>Be extremely careful when walking through water that’s flowing. You can use a stick to check the ground as you walk.</p>
                      <p>Don’t drive your car in a flooded area. You’re at risk of being swept away. Get out of the car and climb to higher ground.</p>
                  </div>
                } else if (this.props.name == "Manmade") {
                  return <div>
                    <h2>Manmade</h2>
                      <p>“Like music and art, love of nature is a common language that can transcend political or social boundaries.” ― Jimmy Carter.</p>
                  </div>
                } else if (this.props.name == "None") {
                  return <div>
                    <h2>None</h2>
                      <p>No specific disasters reported here.</p>
                  </div>
                }
              })()}
            }
            </div>;
          }
        })()}
      </div>
    }
}

export default Tips;

