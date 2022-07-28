import React, { useEffect, useState } from "react";

import "./App.css";

import numbers from "./numbers";

const config = {
  isUniCode: true,
};

function App() {
  const [plnTxt, setPlane] = useState("abc");
  const [encTxt, setEnc] = useState("");
  const [decTxt, setDec] = useState("");

  let originalPlaneText = "";

  //IMPORTANT: should always be even ...
  const bits_LengthForRandomizedPadding = 120;

  // NOTE :
  // This below regExMinLengthSperatorOfBinary is used to seperate the binary ...
  //
  // Generated after ::: someRandomText :::: is binarized ...
  // in to spaces ... result is in STEP 3.
  // Eg:
  // STEP 1 :
  // Original is : 0101010100101001 to
  // STEP 2 :
  // based of this : if (bits_LengthForRandomizedPadding - 4) = 12-4 = 8 in regExMinLengthSperatorOfBinary
  // STEP 3 :
  // Result is : 01010101 00101001
  // STEP 4 :
  // Now  const bits_LengthForRandomizedPadding = 12; is used in paddingRandom();
  // 101001010101 101100101001
  // 1010 , 1011 is randomly generated and preFixed ...
  //
  const regExMinLengthSperatorOfBinary = new RegExp(
    ".{1," + (bits_LengthForRandomizedPadding - 40) + "}",
    "g"
  );

  const isUniCode = config.isUniCode;

  //
  // When using Unicode Character Set ...
  // 16 ... other wise use 8
  let bitsUsed = 8;

  if (isUniCode === true) {
    bitsUsed = 16;
  }

  const bits_UsedForEncAndDec = bitsUsed;

  const regExSplitBits = new RegExp(".{1," + bits_UsedForEncAndDec + "}", "g");

  ///
  const planeTextMaxLenght = (32 + 1) * bits_UsedForEncAndDec;
  ///

  function shuffle(words: string) {
    var a = words.split(""),
      n = a.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  }

  function shuffleParts(words: string[]) {
    var a = words;
    let n = words.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.splice(0, n).join(",");
  }

  useEffect(() => {
    encrypt("@chinese : 是䘆昵욁駍耀쀀耀ꀀ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addStr(str: string, stringToAdd: string, index: number) {
    return str.substring(0, index) + stringToAdd + str.substring(index + 1);
  }

  function encrypt(planeText: string) {
    console.clear();

    setPlane(planeText);

    console.log("\n\nPlane Text\n\n\n", planeText.length, "\n\n");

    console.log(planeText);

    // 35 because above 1 space and 2 length chars .
    // total 32 + 1 + 2 = 35

    // IMPORTANT: dont delete this below comment.
    // console.log(
    //   "\nLength for padding to use is compulsory ",
    //   35, " or " , " based on max char and 1 space and 2 length or n length you choose for . "
    // );

    // IMPORTANT: min 11 letters to produce : 128 chars by randomizeEntireData();
    let someRandomText =
      "! \"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
    // IMPORTANT: Min 11 letters to produce : 128 chars by randomizeEntireData();
    // 1 extracter adds 7 more letters because of randomizeEntireData(); function .
    // "anshika-kajal-amulya-lionanshika-kajal-amulya-lionanshika-kajal-amulya-lion";

    // IMPORTANT: Extra 1 char info ...
    // Extra 1 is for starting char ... identifying starting character ...
    // so we can remove any extra characters , which are padding zeros ...

    someRandomText = shuffle(someRandomText);

    let encText = "";

    for (let i = 0; i < someRandomText.length; i++) {
      encText += someRandomText[i].charCodeAt(0).toString();
    }

    // console.log(encText.length);

    encText = textToBinary(encText);

    encText = randomizeEntireData(encText).join(" ");

    //generateKey()
    let generatedKey = generateKey();

    //testing :
    // let binary = textToBinary("! \"#$%&'()*+,-./:;<=>?@[:;<=>?@[");
    // let binaryText = binaryToText(binary);
    // console.log("TEMP", binary);
    // console.log("TEMP", binaryText);

    const encDecKey = generatedKey.encDecKey;

    // addStr testing ...
    // console.log(addStr("abc", "GGGG", 2));

    encText = addTextToEncrypt(encText, planeText, generatedKey).join("");

    console.log("original enc txt", encText);

    for (let i = 0; i < encDecKey.length; i++) {
      let secretXorKey = encDecKey[i].secretXorKey;

      // console.log(key[i].rotations);
      console.log("BEFORE XOR", encText.substring(0, 10));
      encText = xorEntireBinary(encText, secretXorKey);
      console.log("AFTER XOR", encText.substring(0, 10));
      console.log("BEFORE", encText.substring(0, 10));
      encText = rotateEncryptionText(encText, encDecKey[i].rotations);
      console.log("AFTER", encText.substring(0, 10));
    }

    encText = (encText.match(regExSplitBits) || []).join(" ");

    console.log("Encrypted Text", encText.split(" ").join("").substring(0, 10));

    encText = binaryToText(encText);

    setEnc(encText);

    decrypt(encText, generatedKey);
  }

  function decrypt(str: string, generatedKey: GeneratedKeyType) {
    let decryptedText = "";
    const encDecKey = generatedKey.encDecKey;
    let secret: string[] = generatedKey.encDecKey[0].secretKey;

    decryptedText = textToBinary(str).split(" ").join("");
    for (let i = encDecKey.length - 1; i >= 0; i--) {
      let rotations = encDecKey[i].rotations;
      let secretXorKey = encDecKey[i].secretXorKey;
      console.log("BEFORE ROTATE", decryptedText.substring(0, 10));
      decryptedText = unRotateEncryptionText(decryptedText, rotations);
      console.log("AFTER ROTATE", decryptedText.substring(0, 10));
      console.log("BEFORE XOR", decryptedText.substring(0, 10));
      decryptedText = xorEntireBinary(decryptedText, secretXorKey);
      console.log("AFTER XOR", decryptedText.substring(0, 10));
      // console.log(rotations);
    }

    decryptedText = extractPlaneTextFromEnc(
      decryptedText,
      secret,
      generatedKey
    );

    setDec(decryptedText);
  }

  function extractPlaneTextFromEnc(
    str: string,
    secret: string[],
    generatedKey: GeneratedKeyType
  ) {
    console.log("dec text original ", str);

    let decryptedText = "";
    for (let i = 0; i < secret.length; i++) {
      decryptedText += str[parseInt(secret[i])];

      // console.log(secret[i], str[parseInt(secret[i])]);
    }

    console.log(
      "Orignial Plane Text",
      originalPlaneText,
      originalPlaneText.length
    );
    console.log("Decrypted Plane Text", decryptedText, decryptedText.length);

    const decryptArray = (decryptedText.match(regExSplitBits) || [])
      .join(" ")
      .split(" ");

    let removingIndex = -1;
    // console.log("To Remove 0 from Decrypting Text Array ", decTextBinArray);

    for (let i = 0; i < decryptArray.length; i++) {
      // console.log(decryptArray[i]);
      if (decryptArray[i] === textToBinary(generatedKey.startingChar)) {
        removingIndex = i;
        break;
      }
    }

    // console.log("Removing From Index", removingIndex);

    if (removingIndex > -1) {
      removingIndex = (removingIndex + 1) * bits_UsedForEncAndDec;
      decryptedText = decryptedText.substring(removingIndex);
    }

    console.log("removingIndex", removingIndex);

    decryptedText = (decryptedText.match(regExSplitBits) || [])
      .join(" ")
      .trim();

    // console.log("Decrypted Binary Text ", decryptedText);
    decryptedText = binaryToText(decryptedText);

    // console.log("Original Text", removingIndex, decryptedText);

    // let indexOflength = decryptedText.lastIndexOf("@");

    // // console.log(indexOflength, decryptedText);

    // let planeTextOriginalLength = parseInt(
    //   decryptedText[indexOflength + 1] + decryptedText[indexOflength + 2]
    // );

    // // let randomRotationNumber =
    // //   decryptedText[indexOflength + 4] +
    // //   decryptedText[indexOflength + 5] +
    // //   decryptedText[indexOflength + 6] +
    // //   decryptedText[indexOflength + 7];

    // // console.log("\n\nRplaneTextOriginalLength : " + planeTextOriginalLength);

    // decryptedText = decryptedText.substring(0, indexOflength);
    // if (planeTextOriginalLength > 0) {
    //   decryptedText = reverse(decryptedText);
    //   decryptedText = decryptedText.substring(0, planeTextOriginalLength);
    //   decryptedText = reverse(decryptedText);
    // }

    // console.log(planeTextOriginalLength);

    const spacesCount = decryptedText.split(" ").length - 1;

    console.log("\n\nDecrypted Text\n\n");
    console.log("\n\n" + decryptedText + "\n\n\n");
    console.log("Plane Text Length ", decryptedText.length);
    console.log("Spaces Length ", spacesCount);

    return decryptedText;
  }

  function addTextToEncrypt(
    encText: string,
    txt: string,
    generatedKey: GeneratedKeyType
  ) {
    // console.log("Int Text", intstr);

    const secretKey = generatedKey.encDecKey[0].secretKey;

    let newEncText = (encText.match(regExSplitBits) || []).join(" ");

    // extra 1 is a starting bit ... prepended at starting .
    // "1" + textToBinary(txt).split(" ").join(""),

    txt = padding(
      textToBinary(generatedKey.startingChar + txt)
        .split(" ")
        .join(""),
      planeTextMaxLenght
    );

    originalPlaneText = txt;
    // console.log("Binary Plane Text", txt, txt.length);

    newEncText = newEncText.split(" ").join("");

    console.log(newEncText.length);

    // console.log("Binary Text newEncText", newEncText);

    // intstr = rotateEncryptionText(intstr);

    // intstr = rotateEncryptionText(intstr);

    // console.log("Binary Text newEncText", secret.length);

    for (let i = 0; i < secretKey.length; i++) {
      let bit = txt[i];
      newEncText = addStr(newEncText, bit, parseInt(secretKey[i]));

      // console.log(secretKey[i], txt[i]);
    }

    console.log(newEncText.length);

    // console.log("Binary Text", intstr);
    // console.log("Binary Length", intstr.length);

    let resultEnc = newEncText.match(regExSplitBits) || [];

    // console.log("resultEnc", resultEnc);

    return resultEnc;
  }

  function randomizeEntireData(intstr: string) {
    intstr = intstr.split(" ").join("");
    intstr = (intstr.match(regExMinLengthSperatorOfBinary) || []).join(" ");
    // console.log(intstr, regExRandomizeSplitBits);
    let resultEnc = intstr.split(" ").map((ele, index) => {
      let result = paddingRandom(ele, bits_LengthForRandomizedPadding);
      // console.log(result);
      return result;
    });

    return resultEnc;
  }

  function xorEntireBinary(txt: string, xorSecret: string) {
    let b1 = txt;

    let charResult = "";
    let xorIndex = 0;
    for (let i = 0; i < b1.length; i++) {
      if (xorIndex > xorSecret.length - 1) {
        xorIndex = 0;
      }

      if (b1[i] === "0" && xorSecret[xorIndex] === "0") {
        charResult += "0";
      } else if (b1[i] === "0" && xorSecret[xorIndex] === "1") {
        charResult += "1";
      } else if (b1[i] === "1" && xorSecret[xorIndex] === "0") {
        charResult += "1";
      } else if (b1[i] === "1" && xorSecret[xorIndex] === "1") {
        charResult += "0";
      }

      xorIndex++;
    }

    return charResult;
  }

  function getRandomChars() {
    // all readable chars ... in ascii table ... their respective integers ...
    const min = 32;
    const max = 126;

    let value = Math.floor(Math.random() * (max - min) + min);

    let randomChar = String.fromCharCode(value);

    return randomChar;
  }

  type GeneratedKeyType = {
    encDecKey: encDecType[];
    startingChar: string;
  };

  type encDecType = {
    secretKey: string[];
    secretXorKey: string;
    rotations: number;
    isUniCode: boolean;
  };

  function shuffleArray(words: string) {
    var a = words.split(","),
      n = a.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join(",");
  }

  function generateSecretArray() {
    // console.log("numbers", numbers.numbers, planeTextMaxLenght);

    const numbers2 = [...numbers];

    // console.log(numbers2.length);
    let key = shuffleArray(numbers2.splice(0, 2600).join(","));

    let splicedKey = key
      .split(",")
      .splice(0, planeTextMaxLenght)
      .sort((a, b) => parseInt(b) - parseInt(a));

    // console.log(key);

    return splicedKey;
  }

  function generateKey() {
    let secretStartingCharGenerated: string = getRandomChars();

    let generatedKey: GeneratedKeyType = {
      encDecKey: [],
      startingChar: secretStartingCharGenerated,
    };

    for (let i = 0; i < 1; i++) {
      const secretKey = generateSecretArray();

      // console.log(secretKey);

      // console.log(planeTextMaxLenght);

      const secretXorKey = textToBinary(generateSecretArray().join(""))
        .split(" ")
        .join("");

      // console.log("secretXorKey", secretXorKey);

      const min = 2000;
      const max = 5000;
      let rotations = Math.floor(Math.random() * (max - min) + min);

      let genKey: encDecType = {
        secretKey: secretKey,
        secretXorKey: secretXorKey,
        rotations: rotations,
        isUniCode: config.isUniCode,
      };

      generatedKey.encDecKey.push(genKey);
    }

    console.log("\n", generatedKey, "\n\n");

    return generatedKey;
  }

  // function reverse(str: string) {
  //   let reversed = "";
  //   for (var i = str.length - 1; i >= 0; i--) {
  //     reversed += str[i];
  //   }
  //   return reversed;
  // }

  function unRotateEncryptionText(encryptedText: string, rotations: number) {
    for (let i = 0; i < rotations; i++) {
      encryptedText = unshift(encryptedText);
    }
    return encryptedText;
  }

  function rotateEncryptionText(encryptedText: string, rotations: number) {
    for (let i = 0; i < rotations; i++) {
      encryptedText = shift(encryptedText);
    }
    return encryptedText;
  }

  function unshift(words: string) {
    var unshifted = words.substring(1, words.length) + words.substring(0, 1);
    // console.log("unshifted", unshifted, words.length);

    return unshifted;
  }

  function shift(words: string) {
    var shifted =
      words.substring(words.length - 1, words.length) +
      words.substring(0, words.length - 1);
    // console.log("shifted", shifted, words.length);
    return shifted;
  }

  function padding(
    strForPadding: string,
    padding: number,
    charToPadding: string = "0"
  ) {
    let str = strForPadding;
    for (let i = 0; i < padding; i++) {
      if (str.length < padding) {
        str = charToPadding + str;
      }
    }

    return str;
  }

  function paddingRandom(strForPadding: string, padding: number) {
    let charToPadding: string = "";
    // console.log("str for padding", strForPadding);
    // console.log(padding);

    let str = strForPadding;

    for (let i = 0; i < padding; i++) {
      if (str.length < padding) {
        let someRandome = Math.random() * 1 + 1;

        // if (str.length + 1 === padding) {
        //   charToPadding = "0";
        //   str = charToPadding + str;
        // } else {

        // }

        if (someRandome > 1.5) {
          charToPadding = "1";
        } else {
          charToPadding = "0";
        }
        str = charToPadding + str;
      }
    }

    // console.log(str);

    return str;
  }

  function binaryToText(binary: string) {
    let binaryAry = binary.split(" ");
    let binToText = binaryAry
      .map((elem) => String.fromCharCode(parseInt(elem, 2)))
      .join("");

    return binToText;
  }

  const textToBinary = (str = "", padding = bits_UsedForEncAndDec) => {
    console.log("decBitsUsed", bits_UsedForEncAndDec);
    let res = "";
    res = str
      .split("")
      .map((char) => {
        let Code = char.charCodeAt(0).toString(2);
        if (Code.length < padding) {
          for (let i = 0; i < padding; i++) {
            Code = "0" + Code;

            if (Code.length === bits_UsedForEncAndDec) {
              break;
            }
          }
        }
        return Code;
      })
      .join(" ");

    return res;
  };

  return (
    <div className="App">
      <header className="App-header">
        Plane Text : <br />
        <br /> <div>{plnTxt}</div>
        Length : {plnTxt.length}
        <br />
        <br />
        Encrypted Text : <br /> <br />{" "}
        <div style={{ wordBreak: "break-all" }}>{encTxt}</div>
        Length : {encTxt.length}
        <br />
        <br />
        Decrypted Text : <br /> <br />{" "}
        <div style={{ wordBreak: "break-all" }}>{decTxt}</div>
        Length : {decTxt.length}
        <br />
        <br />
      </header>
    </div>
  );
}

export default App;
