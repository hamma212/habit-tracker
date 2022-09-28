import { db, auth, storage } from "@/firebaseConfig.js";
import firebase from "firebase/app";

export async function addHabit(habit, image) {
  console.log("Adding habit:" + habit.name);
  db.collection("habit")
    .add(habit)
    .then((docRef) => {
      console.log(
        "Habit '" + habit.name + "' document written with ID: ",
        docRef.id
      );
      if (image != null) {
        var storageRef = storage.ref();
        var habitsRef = storageRef.child("habitImages/" + auth.currentUser.uid + "/" + image.name);
        habitsRef.put(image).then(() => {
          habitsRef.getDownloadURL().then(url => {
            docRef.update({ imageUrl: url })
          })
        });
      }
    })
    .catch((e) => {
      console.error("Error adding Habit '" + habit.name + "' document: ", e);
    });
}

export async function editHabit(habit, docId) {
  db.collection("habit")
    .doc(docId)
    .update(habit)
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

export async function editImage(newImage, docId) {
  var storageRef = storage.ref();
  var habitsRef = storageRef.child("habitImages/" + auth.currentUser.uid + "/" + newImage.name);
  habitsRef.put(newImage).then(() => {
    habitsRef.getDownloadURL().then(url => {
      db.collection("habit")
        .doc(docId)
        .update({ imageName: newImage.name, imageUrl: url })
        .then(() => {
          console.log("Image successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating Image: ", error);
        });
    })
  });

}

export async function deleteHabit(docId) {
  db.collection("habit")
    .doc(docId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

export async function addCategory(category) {
  db.collection("category")
    .add(category)
    .then((docRef) => {
      console.log(
        "Category '" + category.name + "' document written with ID: ",
        docRef.id
      );
    })
    .catch((e) => {
      console.error("Error adding Habit '" + category.name + "' document: ", e);
    });
}
export async function editCategory(category, docId) {
  db.collection("category")
    .doc(docId)
    .update(category)
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

export async function dragAndDropCategory(habit, category) {
  db.collection("habit").doc(habit).update({ 'category': category });
}

export async function getUserProfile() {
  let userProfile = [];
  try {
    const querySnapshot = await db
      .collection("User")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data();
      data["id"] = doc.id;
      userProfile.push(data);
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  return userProfile;
}

export async function addUsers(user) {
  const query = db.collection("User").where("userId", "==", user.uid);
  const snapshotSize = await query.get().then((querySnapshot) => {
    return querySnapshot.size;
  });
  if (snapshotSize == 0) {
    db.collection("User").add({
      userId: user.uid,
      profileImage: user.photoURL,
    });
  }
}

export async function getBestStreak() {
  var bestStreak = 0;
  try {
    await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .orderBy("bestStreak", "desc")
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          bestStreak = querySnapshot.docs[0].data().bestStreak;
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  return bestStreak;
}

export async function getAllCompletedHabitsForUser(userId) {

  var completedHabits = [];

  try {
    await db
      .collection('habit')
      .where('userId', '==', userId)
      .orderBy('name')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          if (data['currentStreak'] >= data['goalDuration']) {
            data['id'] = doc.id
            completedHabits.push(data)
          }
        });
      })
  } catch (err) {
    console.log("Error getting documents: ", err);
  }
  return completedHabits;

}

export async function getAllCompletedHabitsForCategory(catId) {

  var completedHabits = [];

  try {
    await db
      .collection('habit')
      .where('category', '==', catId)
      .orderBy('name')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          if (data['currentStreak'] >= data['goalDuration']) {
            data['id'] = doc.id
            completedHabits.push(data)
          }
        });

      })
  } catch (err) {
    console.log("Error getting documents: ", err);
  }
  return completedHabits;

}

export async function getHabitData(habitId) {
  var bestStreak = 0;
  var currentStreak = 0;
  var completions = 0;
  var startDate = "";
  var goalDuration = 0;
  var completionDate = "";
  var remainingDays = 0
  var passDays = 0
  const curDate = firebase.firestore.Timestamp.fromDate(new Date());
  let habitData = [];
  try {
    await db
      .collection("habit")
      .doc(habitId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          passDays = (curDate - querySnapshot.data().startDate) / 3600 / 24;
          completions = querySnapshot.data().updateTimes.length;
          currentStreak =  goalDuration = querySnapshot.data().currentStreak;
          goalDuration = querySnapshot.data().goalDuration
          // let percentage = (parseInt(passDays) / goalDuration);
          startDate = querySnapshot.data().startDate
          goalDuration = querySnapshot.data().goalDuration
          bestStreak = querySnapshot.data().bestStreak;
          // habitData["percentage"] = percentage.toFixed(2);
          habitData["userId"] = querySnapshot.data().userId;
          habitData["completed"] = (querySnapshot.data().goalDuration ? querySnapshot.data().goalDuration - querySnapshot.data().currentStreak <= 0 : false)
          habitData["startDate"] = (startDate.toDate().getMonth() + 1) + '/' + startDate.toDate().getDate() + '/' + startDate.toDate().getFullYear()
          remainingDays = parseInt(goalDuration - passDays)
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  habitData["bestStreak"] = bestStreak;
  habitData["completions"] = completions;
  var temp = firebase.firestore.Timestamp.fromMillis((startDate.seconds + goalDuration * 86400) * 1000).toDate();
  if (goalDuration == undefined) {
    habitData["completionDate"] = 'No Data'
    habitData["remainingDays"] = 'No Data'
    habitData["percentage"] = 'No Data'
    return habitData
  } else {
    completionDate = (temp.getMonth() + 1) + '/' + temp.getDate() + '/' + temp.getFullYear()
    habitData["completionDate"] = completionDate
    // The goal has been completed or not
    // if (remainingDays <= 0) {
    if(goalDuration <= currentStreak){
      habitData["remainingDays"] = 0
      habitData["percentage"] = 100
    } else {
      habitData["remainingDays"] = remainingDays
      habitData["remainingDays"] = goalDuration - currentStreak;
      var percentage = (currentStreak/ goalDuration) * 100;
      // var percentage = (passDays / goalDuration) * 100
      habitData["percentage"] = percentage.toFixed(2);
    }
  }
  return habitData;
}


export async function getTotalCompletions() {
  var completionCount = 0;
  try {
    const querySnapshot = await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let dates = data["updateTimes"];
      completionCount = completionCount + dates.length;
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  return completionCount;
}

export async function getTotalPercentage() {
  // const curDate = firebase.firestore.Timestamp.fromDate(new Date());
  // let misCompletionsCount = 0;
  // let totalPassDays = 0;
  let completions = 0;
  let totalCompletion = 0;
  try {
    const querySnapshot = await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      // let completionDays = data["completionDays"];
      // Add the length of completionDays array of each habit
      totalCompletion += 1;

      if (data.goalDuration <= data.currentStreak) {
        completions += 1;
      }
      // totalCompletion = totalCompletion + completionDays.length;
      // If no completion record -> misCompletion ++
      // if(completionDays.length == 0){
      //   misCompletionsCount = misCompletionsCount + 1
      // }
      // let data = doc.data();
      // let date = data["startDate"];
      // let completionDays = data["completionDays"];
      // let completionCount = completionDays.length;
      // totalCompletion = completionCount + totalCompletion;
      // let passDays = (curDate - date) / 3600 / 24;
      // totalPassDays = passDays + totalPassDays;
      // let misCompletions = passDays - completionCount;
      // misCompletionsCount = misCompletionsCount + parseInt(misCompletions);
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }

  var percentage = 0;
  if (totalCompletion != 0) {
    percentage = (completions/totalCompletion) * 100

  }
  // if (totalCompletion !== 0 && totalPassDays !== 0) {
  //   percentage = 100 * (totalCompletion / totalPassDays);
  // }
  // var total = totalCompletion + misCompletionsCount
  // if(totalCompletion != 0 && total != 0) {
  //   percentage = (totalCompletion / total) * 100
  // }
  return percentage.toFixed(2);
}


export async function getUserWeekBarChart() {
  // console.log("Getting weekLineChart for user: " + auth.currentUser.uid);
  // Get timeStamp for last 7 days
  var millis = 604800000 - 86400000
  let dateArray = []
  var date = new Date
  date.setHours(0, 0, 0)
  // const weekTimeStamp = firebase.firestore.Timestamp.fromMillis(date - millis)
  for (var i = 0; i < 7; i++) {
    let days = []
    let weekday = firebase.firestore.Timestamp.fromMillis(date - millis).toDate();
    days["weekDay"] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][weekday.getDay()]
    days["timeStamp"] = firebase.firestore.Timestamp.fromMillis(date - millis);
    days["counts"] = 0
    dateArray.push(days)
    millis = millis - 86400000
  }
  var weekDays = []
  for(var index = 0; index < 7; index++) {
    let days = []
    days["weekDay"] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
    days["counts"] = 0
    weekDays.push(days)
  }
  // Get update timeStamp in last 7 days
  let habitDateArray = []
  let daysOfWeek = []
  try {
    const querySnapshot = await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let weekDay = data["daysOfWeek"]
      for (let j in weekDay) {
        if (!daysOfWeek.includes(weekDay[j])) {
          daysOfWeek.push(weekDay[j])
        }
        let completionDays = data["updateTimes"]
        for(let i in completionDays){
          // if(completionDays[i] > weekTimeStamp){
          //   habitDateArray.push(completionDays[i]);
          // }

          habitDateArray.push(completionDays[i]);
        }
      }
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // Count updateTimeStamp for each day 
  // for(var j = 0; j < habitDateArray.length; j++){
  //   var habitItem = habitDateArray[j].toDate().setHours(0, 0, 0)
  //   for(var k = 0; k < 7; k ++){
  //     var dateArrayItem = dateArray[k].timeStamp.seconds
  //     if(dateArrayItem == habitItem / 1000){
  //       dateArray[k].counts = dateArray[k].counts + 1
  //     }
  //   }
  // }
  // Count timeStamp for each week day
  for(var j = 0; j < habitDateArray.length; j++){
    var dayIndex = habitDateArray[j].toDate().getDay()
    weekDays[dayIndex].counts = weekDays[dayIndex].counts + 1
  }

  // Sort weekDay that counts!=0 || belongs to daysOfWeek
  let result = []
  for(var a = 0; a < 7; a ++){
      let temp = []
      temp["counts"] = weekDays[a].counts
      temp["weekDay"] = weekDays[a].weekDay
      if(daysOfWeek.includes(weekDays[a].weekDay)){

        temp["color"] = '#374785'
      } else {
        temp["color"] = '#ABD0E6'
      }
      result.push(temp)
  }
  return result
}

export async function getHabitWeekBarChart (habitId) {
  var weekDays = []
  for(var index = 0; index < 7; index++) {
    let days = []
    days["weekDay"] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
    days["counts"] = 0
    weekDays.push(days)
  }
  // Get completions timeStamp in last 7 days && DaysofWeek
  let daysOfWeek = [];
  let habitDateArray = []
  try {
    await db
      .collection('habit')
      .doc(habitId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          daysOfWeek = querySnapshot.data().daysOfWeek
          let updateTimes = querySnapshot.data().updateTimes;

          for(let i in updateTimes){
            habitDateArray.push(updateTimes[i]);
          }
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }  
  // Count timeStamp for each week day
  for(var j = 0; j < habitDateArray.length; j++){
    var dayIndex = habitDateArray[j].toDate().getDay()
    weekDays[dayIndex].counts = weekDays[dayIndex].counts + 1
  }

  // Sort weekDay that counts!=0 || belongs to daysOfWeek
  let result = []
  for(var a = 0; a < 7; a ++){
    let temp = []
    temp["counts"] = weekDays[a].counts
    temp["weekDay"] = weekDays[a].weekDay
    if(daysOfWeek.includes(weekDays[a].weekDay)){
      temp["color"] = '#374785'
    } else {
      temp["color"] = '#ABD0E6'
    }
    result.push(temp)
  }
  return result
}


export async function getHabitProgressChart (habitId) {
  // Get current Date
  var curDate = new Date
  curDate = curDate.setHours(0, 0, 0) / 1000
  curDate = parseInt(curDate)
  curDate = curDate + 86400 * 1
  // Get creation Date and updateTimes and dayOfWeek
  let habitDateArray = []
  var creationDate = new Date
  let daysOfWeek = [];
  try {
    await db
      .collection('habit')
      .doc(habitId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          creationDate = querySnapshot.data().initialStartDate ? querySnapshot.data().initialStartDate : querySnapshot.data().creationDate;
          daysOfWeek = querySnapshot.data().daysOfWeek
          let completionDays = querySnapshot.data().updateTimes;
          for (let i in completionDays) {
            habitDateArray.push(completionDays[i]);
          }
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // Set creation Date to 00:00:00 and fetch the TimeStamp between cur and creation
  creationDate = creationDate.toDate().setHours(0, 0, 0) / 1000
  creationDate = parseInt(creationDate)
  let index = (curDate - creationDate) / 86400
  let dateArray = []
  var date = new Date
  date.setHours(0, 0, 0)

  for(let i = 0; i < index; i++){
  // for(let i = index; i >= 1; i--){
    var millis = 86400 * i 
    let days = []
    const dayTemp = new Date(( creationDate + millis) * 1000);
    // let weekday = firebase.firestore.Timestamp.fromMillis( ( creationDate + millis) * 1000).toDate();
    days["weekDay"] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayTemp.getDay()]        
    // days["timeStamp"] = firebase.firestore.Timestamp.fromMillis(date - millis);
    days["timeStamp"] = new Date(( creationDate + millis) * 1000).getTime();
    days["counts"] = 0;
    dateArray.push(days)
  }
  // Count completions for each day 
  for(var j = 0; j < habitDateArray.length; j++){
    var habitItem = parseInt(habitDateArray[j].toDate().setHours(0, 0, 0) / 1000 )
    for(var k = 0; k < dateArray.length; k ++){
      var dateArrayItem = parseInt( dateArray[k].timeStamp / 1000 )
      if(dateArrayItem == habitItem){
        dateArray[k].counts = dateArray[k].counts + 1
      }
    }
  }

  // Get increment data
  let result = []
  var incrementCounts = 0
  for (var a = 0; a < dateArray.length; a++) {
    let temp = []
    temp["timeStamp"] = dateArray[a].timeStamp
    temp["weekDay"] = dateArray[a].weekDay
    if (dateArray[a].counts == 0 && daysOfWeek.includes(dateArray[a].weekDay)) {
      // updateTimeStamp counts == 0 in a date that belongs to daysOfWeek
      incrementCounts = 0 // Streak break, incrementCounts set to 0
      temp["counts"] = incrementCounts
    } else if (dateArray[a].counts == 0 && !daysOfWeek.includes(dateArray[a].weekDay)) {
      // updateTimeStamp counts == 0 in a date that NOT belongs to daysOfWeek
      temp["counts"] = incrementCounts
    } else {
      // updateTimeStamp counts != 0
      incrementCounts = dateArray[a].counts + incrementCounts
      temp["counts"] = incrementCounts
    }
    result.push(temp)
  }
  return result
}

export async function getHabitTimeStamp(habitId) {
  // Get TimeStamp Array
  // 1. Array from 0 to 24
  // var hoursArray = []
  // for(let index = 0; index < 24; index ++){
  //   var temp = []
  //   temp["hour"] = index
  //   temp["counts"] = 0
  //   hoursArray.push(temp)
  // } 

  // 2. Hours: 0, 3, 6, 9, 12, 15, 18, 21, 24
  var threeHoursArray = []
  for (let index_5 = 0; index_5 < 9; index_5++) {
    var temp_2 = []
    temp_2["hour"] = index_5 * 3
    temp_2["counts"] = 0
    threeHoursArray.push(temp_2)
  }
  // Get updateTimeStamp
  let habitDateArray = []
  let habitTimeStampHours = []
  try {
    await db
      .collection('habit')
      .doc(habitId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          // let updateTimes = querySnapshot.data().updateTimes;
          let updateTimes = querySnapshot.data().checkInTimes;
          for (let i in updateTimes) {
            var temp = firebase.firestore.Timestamp.fromMillis(updateTimes[i].seconds * 1000).toDate().getHours()
            habitTimeStampHours.push(temp)
            habitDateArray.push(updateTimes[i]);
          }
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // 1. Count timeStamp for 24h
  // for(let index_2 = 0; index_2 < habitTimeStampHours.length; index_2++){
  //   for(let index_3 = 0; index_3 < 24; index_3++){
  //     if(habitTimeStampHours[index_2] == index_3){
  //       hoursArray[index_3].counts = hoursArray[index_3].counts + 1
  //     }
  //   }
  // }

  // 2. Count timeStamp for 3_hour
  for (let index_6 = 0; index_6 < habitTimeStampHours.length; index_6++) {
    for (let index_7 = 0; index_7 < 7; index_7++) {
      // see current item belongs to which hour gap
      if (threeHoursArray[index_7].hour <= habitTimeStampHours[index_6] && threeHoursArray[index_7 + 1].hour > habitTimeStampHours[index_6]) {
        threeHoursArray[index_7].counts = threeHoursArray[index_7].counts + 1
      }
    }
  }
  var result = this.timeStampDensity(threeHoursArray)
  return result
}

export function timeStampDensity(timeStampArray) {
  // Calculate the density of timeStamp in 24 hours
  // 1. Guassian Kernel 
  const u = 1
  // const histogram = 1
  const K = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(- Math.pow(u, 2) / 2)
  // 2. Kernel Estimator (histogram = 1)
  var result = []
  for (var i = 0; i < timeStampArray.length; i++) {
    var temp = []
    temp["hour"] = i * 3
    if (i > 0 && i < timeStampArray.length - 1 && timeStampArray[i].counts == 0) {
      var histogram_counts = timeStampArray[i - 1].counts + timeStampArray[i + 1].counts
      temp["counts"] = histogram_counts * K
    } else {
      temp["counts"] = timeStampArray[i].counts
    }
    result.push(temp)
  }
  return result
}

export async function getUserTimeStamp() {
  // Hours: 0, 3, 6, 9, 12, 15, 18, 21, 24
  var threeHoursArray = []
  for (let index_5 = 0; index_5 < 9; index_5++) {
    var temp_2 = []
    temp_2["hour"] = index_5 * 3
    temp_2["counts"] = 0
    threeHoursArray.push(temp_2)
  }
  // Get creation Date and updateTimes 
  let habitDateArray = []
  let habitTimeStampHours = []
  try {

    const querySnapshot = await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      // let updateTimes = data["updateTimes"]
      let updateTimes = data["checkInTimes"]
      for (let i in updateTimes) {
        var temp = firebase.firestore.Timestamp.fromMillis(updateTimes[i].seconds * 1000).toDate().getHours()
        habitTimeStampHours.push(temp)
        habitDateArray.push(updateTimes[i]);
      }
    });

  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // Count timeStamp for 3_hour
  for (let index_6 = 0; index_6 < habitTimeStampHours.length; index_6++) {
    for (let index_7 = 0; index_7 < 7; index_7++) {
      // see current item belongs to which hour gap
      if (threeHoursArray[index_7].hour <= habitTimeStampHours[index_6] && threeHoursArray[index_7 + 1].hour > habitTimeStampHours[index_6]) {
        threeHoursArray[index_7].counts = threeHoursArray[index_7].counts + 1
      }
    }
  }
  var result = this.timeStampDensity(threeHoursArray)
  return result
}

export async function getUserCompletionChart() {
  // Get timeStamp for last 7 days
  var millis = 604800000 - 86400000
  let dateArray = []
  var date = new Date
  date.setHours(0, 0, 0)
  const weekTimeStamp = firebase.firestore.Timestamp.fromMillis(date - millis)
  for (var i = 0; i < 7; i++) {
    let days = []
    days["timeStamp"] = firebase.firestore.Timestamp.fromMillis(date - millis);
    days["counts"] = 0
    dateArray.push(days)
    millis = millis - 86400000
  }
  // Get completion timeStamp 
  let habitDateArray = []
  try {
    const querySnapshot = await db
      .collection("habit")
      .where("userId", "==", auth.currentUser.uid)
      .get();
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      // let completionDays = data["completionDays"]
      let completionDays = data["updateTimes"]      
      for (let i in completionDays) {
        if (completionDays[i] > weekTimeStamp) {
          habitDateArray.push(completionDays[i]);
        }
      }
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // Count completions for each day 
  for(var j = 0; j < habitDateArray.length; j++){
    var habitItem = parseInt(habitDateArray[j].toDate().setHours(0, 0, 0)) / 1000
    for(var k = 0; k < 7; k ++){
      var dateArrayItem = dateArray[k].timeStamp.seconds
      if(dateArrayItem == habitItem){
        dateArray[k].counts = dateArray[k].counts + 1
      }
    }
  }
  return dateArray
}


export function dayOfTheWeek(date) {
  var day = "";
  switch (date.getDay()) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
  }
  return day;
}

export function getNextUpdateDay(habitData, date) {
  var day = dayOfTheWeek(date);
  var daysList = habitData.daysOfWeek;
  for (let i = 0; i < daysList.length; i++) {
    if (daysList[i] == day) {
      if (i == daysList.length - 1) {
        // console.log(daysList[0]);
        return daysList[0];
      } else {
        return daysList[i + 1];
      }
    }
  }
  return 0;
}


export async function getHabitCateData(habitId) {
  // Get cateId from habit
  var category = ""
  try {
    await db
      .collection('habit')
      .doc(habitId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          category = querySnapshot.data().category;
        } else {
          console.log("No document corresponding to the query!");
        }
      });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  // Get cateData
  var cateData = []
  if (category == "" || category.length == 0) {
    cateData["name"] = 'No Category'
    return cateData
  } else {
    try {
      await db
        .collection('category')
        .doc(category)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            cateData = querySnapshot.data();
          } else {
            console.log("No document corresponding to the query!");
          }
        });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
    // Can't find cate doc by id (No existing Cate)
    if (cateData == undefined) {
      var result = []
      result["name"] = 'No Category'
      return result
    }
  }
  return cateData
}

