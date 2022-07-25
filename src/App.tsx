import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

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
    let n = a.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join(",");
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

    let key = shuffleParts(
      "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256".split(
        ","
      )
    );

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
