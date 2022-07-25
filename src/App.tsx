import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
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
    let n = 256;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.splice(0, n).join(",");
  }

  useEffect(() => {
    encrypt("amulya anil kumar potlapally    ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addStr(str: string, index: number, stringToAdd: string) {
    return (
      str.substring(0, index) + stringToAdd + str.substring(index, str.length)
    );
  }

  function encrypt(txt: string) {
    console.clear();

    let secret = generateKey();
    console.log("Secret :", secret, "\n\n");
    console.log("Plane Text", txt);
    txt = textToBinary(txt).split(" ").join("");

    let someTxt =
      "! \"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    console.log("Plane Text", txt);

    let intstr = "";

    for (let i = 0; i < someTxt.length; i++) {
      intstr += padding(someTxt[i].charCodeAt(0).toString(), 3);
    }

    console.log("Int Text", intstr);

    intstr = textToBinary(intstr);

    console.log("Binary Text", intstr);

    intstr = intstr.split(" ").join("");

    intstr = rotateEncryptionText(intstr);

    intstr = (intstr.match(/.{1,4}/g) || []).join(" ");

    intstr = intstr
      .split(" ")
      .map((ele) => {
        return (ele = paddingRandom(ele, 8));
      })
      .join("");

    intstr = rotateEncryptionText(intstr);

    for (let i = 0; i < secret.length; i++) {
      intstr = addStr(intstr, parseInt(secret[i]), txt[i]);
    }

    console.log("Binary Text", intstr);
    console.log("Binary Length", intstr.length);

    intstr = (intstr.match(/.{1,8}/g) || []).join(" ");

    console.log("Binary Text", intstr);

    intstr = binaryToText(intstr);

    console.log("Binary To Text");

    setEnc(intstr);
  }

  function generateKey() {
    console.log("shuffle parts");

    let key = shuffleParts(numbers.numbers.toString().split(","));

    let encDecKey = key.split(",");

    return encDecKey;
  }

  function unRotateEncryptionText(encryptedText: string) {
    console.log("Secret Rotator :");

    for (let i = 0; i < 10; i++) {
      encryptedText = unshift(encryptedText);
    }
    return encryptedText;
  }

  function rotateEncryptionText(encryptedText: string) {
    console.log("Secret Rotator :");

    for (let i = 0; i < 10; i++) {
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
        <br />
        <br />
        <div>{plnTxt}</div>
        <br />
        <br />
        <div style={{ wordBreak: "break-all" }}>{encTxt}</div>
        <br />
        Length : {encTxt.length}
        <br />
        <br />
      </header>
    </div>
  );
}

export default App;