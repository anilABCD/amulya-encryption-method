import React, { useEffect, useState } from "react";

import "./App.css";

import numbers from "./numbers.json";

function App() {
  const [plnTxt, setPlane] = useState("abc");
  const [encTxt, setEnc] = useState("");
  const [decTxt, setDec] = useState("");

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
    encrypt("anil kumar potlapally");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addStr(str: string, index: number, stringToAdd: string) {
    return (
      str.substring(0, index) + stringToAdd + str.substring(index, str.length)
    );
  }

  function encrypt(planeText: string) {
    console.clear();

    setPlane(planeText);

    // console.log("\n\nPlane Text\n\n\n", planeText.length, "\n\n");

    planeText += "@" + padding(planeText.length.toString(), 2);

    console.log(planeText);

    // 35 because above 1 space and 2 length chars .
    // total 32 + 1 + 2 = 35
    planeText = padding(planeText, 35, " ");

    // IMPORTANT: dont delete this .
    // console.log(
    //   "\nLength for padding to use is compulsory ",
    //   35, " or " , " based on max char and 1 space and 2 length or n length you choose for . "
    // );

    let someRandomText =
      "! \"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
    const planeTextMaxLenght = 35;

    // console.log("someRandomText  ", someRandomText.length);

    someRandomText = shuffle(someRandomText);

    let encText = "";

    for (let i = 0; i < someRandomText.length; i++) {
      encText += someRandomText[i].charCodeAt(0).toString();
    }

    // console.log(encText.length);

    encText = textToBinary(encText);

    encText = randomizeEntireData(encText).join(" ");

    let key = generateKey(planeTextMaxLenght);

    encText = addTextToEncrypt(encText, planeText, key[0].secretKey).join("");

    for (let i = 0; i < key.length; i++) {
      let secretXorKey = key[i].secretXorKey;

      // console.log(key[i].rotations);
      // console.log("BEFORE XOR", encText.substring(0, 10));
      encText = xorEntireBinary(encText, secretXorKey);
      // console.log("AFTER XOR", encText.substring(0, 10));
      // console.log("BEFORE", encText.substring(0, 10));
      encText = rotateEncryptionText(encText, key[i].rotations);
      // console.log("AFTER", encText.substring(0, 10));
    }

    encText = (encText.match(/.{1,8}/g) || []).join(" ");

    encText = binaryToText(encText);

    setEnc(encText);

    decrypt(encText, key);
  }

  function decrypt(str: string, key: encDecType[]) {
    let decryptedText = "";
    let secret: string[] = key[0].secretKey;

    decryptedText = textToBinary(str).split(" ").join("");
    for (let i = key.length - 1; i >= 0; i--) {
      let rotations = key[i].rotations;
      let secretXorKey = key[i].secretXorKey;
      // console.log("BEFORE", decryptedText.substring(0, 10));
      decryptedText = unRotateEncryptionText(decryptedText, rotations);
      // console.log("AFTER", decryptedText.substring(0, 10));
      // console.log("BEFORE XOR", decryptedText.substring(0, 10));
      decryptedText = xorEntireBinary(decryptedText, secretXorKey);
      // console.log("AFTER XOR", decryptedText.substring(0, 10));
      // console.log(rotations);
    }

    decryptedText = extractPlaneTextFromEnc(decryptedText, secret);

    setDec(decryptedText);
  }

  function extractPlaneTextFromEnc(str: string, secret: string[]) {
    // console.log("decrupt Binary", str);

    let decryptedText = "";
    for (let i = 0; i < secret.length; i++) {
      decryptedText += str[parseInt(secret[i])];
    }

    decryptedText = (decryptedText.match(/.{1,8}/g) || []).join(" ").trim();
    // console.log(decryptedText);
    decryptedText = binaryToText(decryptedText);

    console.log("Original Text", decryptedText);

    let indexOflength = decryptedText.lastIndexOf("@");

    // console.log(indexOflength, decryptedText);

    let planeTextOriginalLength = parseInt(
      decryptedText[indexOflength + 1] + decryptedText[indexOflength + 2]
    );

    // let randomRotationNumber =
    //   decryptedText[indexOflength + 4] +
    //   decryptedText[indexOflength + 5] +
    //   decryptedText[indexOflength + 6] +
    //   decryptedText[indexOflength + 7];

    // console.log("\n\nRplaneTextOriginalLength : " + planeTextOriginalLength);

    decryptedText = decryptedText.substring(0, indexOflength);
    if (planeTextOriginalLength > 0) {
      decryptedText = reverse(decryptedText);
      decryptedText = decryptedText.substring(0, planeTextOriginalLength);
      decryptedText = reverse(decryptedText);
    }

    console.log(planeTextOriginalLength);

    const spacesCount = decryptedText.split(" ").length - 1;

    console.log("\n\nDecrypted Text\n\n");
    console.log("\n\n" + decryptedText + "\n\n\n");
    console.log("Plane Text Length ", decryptedText.length);
    console.log("Spaces Length ", spacesCount);

    return decryptedText;
  }

  function addTextToEncrypt(encText: string, txt: string, secret: string[]) {
    // console.log("Int Text", intstr);

    let newEncText = (encText.match(/.{1,8}/g) || []).join(" ");

    txt = textToBinary(txt).split(" ").join("");

    // console.log("Binary Text innst", txt);

    newEncText = newEncText.split(" ").join("");

    // console.log("Binary Text newEncText", newEncText);

    // intstr = rotateEncryptionText(intstr);

    // intstr = rotateEncryptionText(intstr);

    // console.log("Binary Text newEncText", secret.length);

    for (let i = 0; i < secret.length; i++) {
      newEncText = addStr(newEncText, parseInt(secret[i]), txt[i]);

      // console.log(intstr[parseInt(secret[i]) + 1], secret[i], txt[i]);
    }

    // console.log("Binary Text", intstr);
    // console.log("Binary Length", intstr.length);

    let resultEnc = newEncText.match(/.{1,8}/g) || [];

    return resultEnc;
  }

  function randomizeEntireData(intstr: string) {
    intstr = (intstr.match(/.{1,4}/g) || []).join(" ");

    let resultEnc = intstr.split(" ").map((ele, index) => {
      return (ele = paddingRandom(ele, 8));
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

  type encDecType = {
    secretKey: string[];
    secretXorKey: string;
    rotations: number;
  };

  function generateKey(planeTextMaxLength: number) {
    let encDecKey: encDecType[] = [];

    for (let i = 0; i < 2; i++) {
      let key = shuffleParts(numbers.numbers.toString().split(","));

      const secretKey = key
        .split(",")
        .splice(0, planeTextMaxLength * 8)
        .sort((a, b) => parseInt(a) - parseInt(b));

      let key2 = shuffleParts(numbers.numbers.toString().split(","));

      const secretXorKey = textToBinary(
        key2
          .split(",")
          .splice(0, planeTextMaxLength * 8)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .join("")
      )
        .split(" ")
        .join("");

      const min = 2000;
      const max = 5000;
      let rotations = Math.floor(Math.random() * (max - min) + min);

      let genKey: encDecType = {
        secretKey: secretKey,
        secretXorKey: secretXorKey,
        rotations: rotations,
      };

      encDecKey.push(genKey);
    }

    console.log("\n", encDecKey, "\n\n");

    return encDecKey;
  }

  function reverse(str: string) {
    let reversed = "";
    for (var i = str.length - 1; i >= 0; i--) {
      reversed += str[i];
    }
    return reversed;
  }

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
    padding: number = 8,
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

  function paddingRandom(strForPadding: string, padding: number = 8) {
    let charToPadding: string = "0";

    let str = strForPadding;
    for (let i = 0; i < padding; i++) {
      if (str.length < padding) {
        let someRandome = Math.random() * 1 + 1;

        if (someRandome > 1.5) {
          charToPadding = "1";
        } else {
          charToPadding = "0";
        }

        str = charToPadding + str;
      }
    }

    return str;
  }

  function binaryToText(binary: string) {
    let binaryAry = binary.split(" ");
    let binToText = binaryAry
      .map((elem) => String.fromCharCode(parseInt(elem, 2)))
      .join("");

    return binToText;
  }

  const textToBinary = (str = "", padding = 8) => {
    let res = "";
    res = str
      .split("")
      .map((char) => {
        let Code = char.charCodeAt(0).toString(2);
        if (Code.length < padding) {
          for (let i = 0; i < padding; i++) {
            Code = "0" + Code;

            if (Code.length === 8) {
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
