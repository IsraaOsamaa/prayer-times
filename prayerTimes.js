let date = new Date();

let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();

let hours = date.getHours();
let minutes = date.getMinutes();
let time = `${hours}:${minutes}`;

let cities = [
  {
    ct: "Jerusalem",
    country: "ps",
    ar: "القدس",
  },
  { ct: "Riyadh", country: "SA", ar: "القدس" },
  {
    ct: "Makkah",
    country: "SA",
    ar: "القدس",
  },
  {
    ct: "Damascus",
    country: "Syria",
    ar: "القدس",
  },
];

function setCities() {
  ``;
  for (city of cities) {
    let content = `
    <option >${city.ct} ${city.country}</option>
    `;

    document.querySelector("#cities").innerHTML += content;
  }
}

document.querySelector("#cities").addEventListener("change", (e) => {
  let targ = e.target.value.split(" ");
  let city = targ[0];
  let co = targ[1];
  console.log(city + " " + co);

  getAthanTime(day, month, year, city, co);
  document.querySelector(".city p").innerHTML = city;
});

function getAthanTime(day, month, year, city, country) {
  axios
    .get(`http://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}`, {
      params: {
        city: city,
        country: country,
      },
    })
    .then(function (response) {
      console.log(response.data.data);
      const timings = response.data.data.timings;
      //
      let prayerTimings = [
        timings.Fajr,
        timings.Sunrise,
        timings.Dhuhr,
        timings.Asr,
        timings.Maghrib,
        timings.Isha,
      ];
      // set all timings
      athanTime("Fajr", timings.Fajr);
      athanTime("sunrise", timings.Sunrise);
      athanTime("dohur", timings.Dhuhr);
      athanTime("asr", timings.Asr);
      athanTime("Maghrib", timings.Maghrib);
      athanTime("isha", timings.Isha);

      // set date
      document.querySelector("#currentDate").innerHTML =
        response.data.data.date.readable + "<br/>" + time;

      // next prayer
      nextPrayer(time, prayerTimings);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function athanTime(id, time) {
  document.getElementById(id).querySelector("p").innerHTML = time;
}

function nextPrayer(time, ...prayerTimes) {
  const pray = ["fajr", "Sunrise", "Dohur", "Asr", "Magrib", "Isha"];
  const currentTime = time;
  const hour = hours,
    min = minutes;
  let next;
  // Compare current time with each prayer time
  for (let i = 0; i < prayerTimes[0].length; i++) {
    let [ho, mn] = prayerTimes[0][i].split(":");
    if (hour <= ho && mn <= min) {
      document.querySelector(".next #remainingTime").innerHTML =
        prayerTimes[0][i];
      document.querySelector(".next #nextPrayer").innerHTML = pray[i];
      return;
    }
  }

  // If current time is after all prayers, the next prayer is Fajr the next day
  document.querySelector(".next #remainingTime").innerHTML = prayerTimes[0][0];
  document.querySelector(".next #nextPrayer").innerHTML = pray[0];
}

setCities();
getAthanTime(day, month, year, "Jerusalem", "ps");
