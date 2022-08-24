'use strict';

exports.TimeExpiry=(time)=>{
    return Math.floor(Date.now()/1000)-time;
}

exports.stringToarray=(str)=>{
    return str.split(',');
}
const a = "abb, bbc, ccd";
const b=exports.stringToarray(a);
// console.log(b);
// console.log(b[1][1]);
// console.log(typeof(exports.stringToarray('abb,bbc,ccd')));

// exports.checkFirstletter=(string)=>{
//     const b=exports.stringToarray(string);
//     b.foreach((element)=>{
//         if(element[0]==='a'){
//             return true;
//         };
//     })
// }

// function getFirstLetters(str) {
//     const firstLetters = str
//       .split(' ')
//       .map(word => word[0])
//       .join('');
  
//     return firstLetters;
//   }
  
  
//   console.log(getFirstLetters('Alice, Bob, Charlie'));
  
//   // 👇️ ONE
//   console.log(getFirstLetters('Oscar   Noah   Emily.'));
  let arr1 = [2,3,4,5,2,3,4,5];
  let arr2 = [2,3];

  //storing duplicates
    // let duplicates = [];
    // for(let i = 0; i < arr1.length; i++) {
    //     for(let j = 0; j < arr2.length; j++) {
    //         if(arr1[i] === arr2[j]) {
    //             duplicates.push(arr1[i]);
    //         }
    //     }
    // }

    // console.log(duplicates);

    // arr1=arr1.filter(val=>!arr2.includes(val));
    // console.log(arr1);

    exports.removeduplicates=(arr)=>{
        // return arr.filter((item, index)=>arr.indexOf(item)===index);
        let uniq = [...new Set(arr)];
        return uniq;
    }

    console.log(exports.removeduplicates(['Yemen', 'Yemen']));

    // const d = arr1.toString();
    // console.log(d);

