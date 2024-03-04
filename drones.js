const readline = require('readline');

// Function to read user input
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Function to calculate delivery routes
function calculateRoutes(drones, locations) {
  let routes = [];

  // Iterate over the locations
  locations.forEach((location) => {
    let remainingWeight = location.weight;
    let tripNumber = 1;
    let trips = [];

    // Distribute the weight among the drones
    while (remainingWeight > 0) {
      drones.forEach((drone) => {
        if (remainingWeight > 0 && drone.maxWeight > 0) {
          const weightToCarry = Math.min(remainingWeight, drone.maxWeight);
          trips.push({ drone: drone.name, weight: weightToCarry });
          remainingWeight -= weightToCarry;
        }
      });
    }

    // Add the route to the routes list
    routes.push({ location: location.name, trips: trips, tripNumber: tripNumber });
  });

  return routes;
}

// Main function
async function main() {
  let numDrones;
  let drones = [];

  // Ask for the number of drones and validate the input
  while (true) {
    numDrones = parseInt(await prompt('How many drones do you want to add? '));
    if (!isNaN(numDrones) && numDrones > 0 && numDrones <= 100) {
      break;
    }
    console.log("Please enter a valid number between 1 and 100.");
  }

  // Ask for the name and maximum weight capacity of each drone
  for (let i = 0; i < numDrones; i++) {
    let name, maxWeight;

    // Ask for the drone name and validate the input
    while (true) {
      name = await prompt(`Enter the name of Drone #${i + 1}: `);
      if (name.trim() !== "") {
        break;
      }
      console.log("Drone name cannot be empty.");
    }

    // Ask for the drone's maximum weight capacity and validate the input
    while (true) {
      maxWeight = parseFloat(await prompt(`Enter the maximum weight ${name} can carry (in kilograms): `));
      if (!isNaN(maxWeight) && maxWeight > 0) {
        break;
      }
      console.log("Please enter a valid weight greater than 0.");
    }

    drones.push({ name, maxWeight });
  }

  const locations = [];
  let locationName;

  // Ask for the name and weight of each delivery location
  while (true) {
    locationName = await prompt('Enter the name of the delivery location (or "done" if finished): ');
    if (locationName.trim() === "") {
      console.log("Location name cannot be empty.");
    } else if (locationName.toLowerCase() === 'done') {
      break;
    } else {
      let weight;

      // Ask for the weight of the location and validate the input
      while (true) {
        weight = parseFloat(await prompt(`Enter the total weight needed to be delivered to ${locationName} (in kilograms): `));
        if (!isNaN(weight) && weight > 0) {
          break;
        }
        console.log("Please enter a valid weight greater than 0.");
      }

      locations.push({ name: locationName, weight });
    }
  }

  // Calculate delivery routes
  const routes = calculateRoutes(drones, locations);

  // Display delivery routes
  routes.forEach((route) => {
    console.log(`Location: ${route.location}`);
    route.trips.forEach((trip, index) => {
      console.log(`Trip #${route.tripNumber}: ${trip.drone} should carry ${trip.weight} kg`);
      route.tripNumber++;
    });
    console.log(`Total trips: ${route.trips.length}\n`);
  });
}

// Execute the main function
main().catch(console.error);
