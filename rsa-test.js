/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
 */
var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad="=";

function hex2b64(h) {
  var i;
  var c;
  var ret = "";
  for(i = 0; i+3 <= h.length; i+=3) {
    c = parseInt(h.substring(i,i+3),16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
  }
  if(i+1 == h.length) {
    c = parseInt(h.substring(i,i+1),16);
    ret += b64map.charAt(c << 2);
  }
  else if(i+2 == h.length) {
    c = parseInt(h.substring(i,i+2),16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
  }
  if (b64pad) while((ret.length & 3) > 0) ret += b64pad;
  return ret;
}

// convert a base64 string to hex
function b64tohex(s) {
  var ret = ""
  var i;
  var k = 0; // b64 state, 0-3
  var slop;
  var v;
  for(i = 0; i < s.length; ++i) {
    if(s.charAt(i) == b64pad) break;
    v = b64map.indexOf(s.charAt(i));
    if(v < 0) continue;
    if(k == 0) {
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 1;
    }
    else if(k == 1) {
      ret += int2char((slop << 2) | (v >> 4));
      slop = v & 0xf;
      k = 2;
    }
    else if(k == 2) {
      ret += int2char(slop);
      ret += int2char(v >> 2);
      slop = v & 3;
      k = 3;
    }
    else {
      ret += int2char((slop << 2) | (v >> 4));
      ret += int2char(v & 0xf);
      k = 0;
    }
  }
  if(k == 1)
    ret += int2char(slop << 2);
  return ret;
}

// convert a base64 string to a byte/number array
function b64toBA(s) {
  //piggyback on b64tohex for now, optimize later
  var h = b64tohex(s);
  var i;
  var a = new Array();
  for(i = 0; 2*i < h.length; ++i) {
    a[i] = parseInt(h.substring(2*i,2*i+2),16);
  }
  return a;
}


/*! base64x-1.1.3 (c) 2012-2014 Kenji Urushima | kjur.github.com/jsjws/license
 */
/*
 * base64x.js - Base64url and supplementary functions for Tom Wu's base64.js library
 *
 * version: 1.1.3 (2014 May 25)
 *
 * Copyright (c) 2012-2014 Kenji Urushima (kenji.urushima@gmail.com)
 *
 * This software is licensed under the terms of the MIT License.
 * http://kjur.github.com/jsjws/license/
 *
 * The above copyright and license notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * DEPENDS ON:
 *   - base64.js - Tom Wu's Base64 library
 */

/**
 * Base64URL and supplementary functions for Tom Wu's base64.js library.<br/>
 * This class is just provide information about global functions
 * defined in 'base64x.js'. The 'base64x.js' script file provides
 * global functions for converting following data each other.
 * <ul>
 * <li>(ASCII) String</li>
 * <li>UTF8 String including CJK, Latin and other characters</li>
 * <li>byte array</li>
 * <li>hexadecimal encoded String</li>
 * <li>Full URIComponent encoded String (such like "%69%94")</li>
 * <li>Base64 encoded String</li>
 * <li>Base64URL encoded String</li>
 * </ul>
 * All functions in 'base64x.js' are defined in {@link _global_} and not
 * in this class.
 *
 * @class Base64URL and supplementary functions for Tom Wu's base64.js library
 * @author Kenji Urushima
 * @version 1.1 (07 May 2012)
 * @requires base64.js
 * @see <a href="http://kjur.github.com/jsjws/">'jwjws'(JWS JavaScript Library) home page http://kjur.github.com/jsjws/</a>
 * @see <a href="http://kjur.github.com/jsrsasigns/">'jwrsasign'(RSA Sign JavaScript Library) home page http://kjur.github.com/jsrsasign/</a>
 */
function Base64x() {
}

// ==== string / byte array ================================
/**
 * convert a string to an array of character codes
 * @param {String} s
 * @return {Array of Numbers}
 */
function stoBA(s) {
    var a = new Array();
    for (var i = 0; i < s.length; i++) {
	a[i] = s.charCodeAt(i);
    }
    return a;
}

/**
 * convert an array of character codes to a string
 * @param {Array of Numbers} a array of character codes
 * @return {String} s
 */
function BAtos(a) {
    var s = "";
    for (var i = 0; i < a.length; i++) {
	s = s + String.fromCharCode(a[i]);
    }
    return s;
}

// ==== byte array / hex ================================
/**
 * convert an array of bytes(Number) to hexadecimal string.<br/>
 * @param {Array of Numbers} a array of bytes
 * @return {String} hexadecimal string
 */
function BAtohex(a) {
    var s = "";
    for (var i = 0; i < a.length; i++) {
	var hex1 = a[i].toString(16);
	if (hex1.length == 1) hex1 = "0" + hex1;
	s = s + hex1;
    }
    return s;
}

// ==== string / hex ================================
/**
 * convert a ASCII string to a hexadecimal string of ASCII codes.<br/>
 * NOTE: This can't be used for non ASCII characters.
 * @param {s} s ASCII string
 * @return {String} hexadecimal string
 */
function stohex(s) {
    return BAtohex(stoBA(s));
}

// ==== string / base64 ================================
/**
 * convert a ASCII string to a Base64 encoded string.<br/>
 * NOTE: This can't be used for non ASCII characters.
 * @param {s} s ASCII string
 * @return {String} Base64 encoded string
 */
function stob64(s) {
    return hex2b64(stohex(s));
}

// ==== string / base64url ================================
/**
 * convert a ASCII string to a Base64URL encoded string.<br/>
 * NOTE: This can't be used for non ASCII characters.
 * @param {s} s ASCII string
 * @return {String} Base64URL encoded string
 */
function stob64u(s) {
    return b64tob64u(hex2b64(stohex(s)));
}

/**
 * convert a Base64URL encoded string to a ASCII string.<br/>
 * NOTE: This can't be used for Base64URL encoded non ASCII characters.
 * @param {s} s Base64URL encoded string
 * @return {String} ASCII string
 */
function b64utos(s) {
    return BAtos(b64toBA(b64utob64(s)));
}

// ==== base64 / base64url ================================
/**
 * convert a Base64 encoded string to a Base64URL encoded string.<br/>
 * Example: "ab+c3f/==" &rarr; "ab-c3f_"
 * @param {String} s Base64 encoded string
 * @return {String} Base64URL encoded string
 */
function b64tob64u(s) {
    s = s.replace(/\=/g, "");
    s = s.replace(/\+/g, "-");
    s = s.replace(/\//g, "_");
    return s;
}

/**
 * convert a Base64URL encoded string to a Base64 encoded string.<br/>
 * Example: "ab-c3f_" &rarr; "ab+c3f/=="
 * @param {String} s Base64URL encoded string
 * @return {String} Base64 encoded string
 */
function b64utob64(s) {
    if (s.length % 4 == 2) s = s + "==";
    else if (s.length % 4 == 3) s = s + "=";
    s = s.replace(/-/g, "+");
    s = s.replace(/_/g, "/");
    return s;
}

// ==== hex / base64url ================================
/**
 * convert a hexadecimal string to a Base64URL encoded string.<br/>
 * @param {String} s hexadecimal string
 * @return {String} Base64URL encoded string
 */
function hextob64u(s) {
    return b64tob64u(hex2b64(s));
}

/**
 * convert a Base64URL encoded string to a hexadecimal string.<br/>
 * @param {String} s Base64URL encoded string
 * @return {String} hexadecimal string
 */
function b64utohex(s) {
    return b64tohex(b64utob64(s));
}

var utf8tob64u, b64utoutf8;

if (typeof Buffer === 'function')
{
  utf8tob64u = function (s)
  {
    return b64tob64u(new Buffer(s, 'utf8').toString('base64'));
  };

  b64utoutf8 = function (s)
  {
    return new Buffer(b64utob64(s), 'base64').toString('utf8');
  };
}
else
{
// ==== utf8 / base64url ================================
/**
 * convert a UTF-8 encoded string including CJK or Latin to a Base64URL encoded string.<br/>
 * @param {String} s UTF-8 encoded string
 * @return {String} Base64URL encoded string
 * @since 1.1
 */
  utf8tob64u = function (s)
  {
    return hextob64u(uricmptohex(encodeURIComponentAll(s)));
  };

/**
 * convert a Base64URL encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
 * @param {String} s Base64URL encoded string
 * @return {String} UTF-8 encoded string
 * @since 1.1
 */
  b64utoutf8 = function (s)
  {
    return decodeURIComponent(hextouricmp(b64utohex(s)));
  };
}

// ==== utf8 / base64url ================================
/**
 * convert a UTF-8 encoded string including CJK or Latin to a Base64 encoded string.<br/>
 * @param {String} s UTF-8 encoded string
 * @return {String} Base64 encoded string
 * @since 1.1.1
 */
function utf8tob64(s) {
  return hex2b64(uricmptohex(encodeURIComponentAll(s)));
}

/**
 * convert a Base64 encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
 * @param {String} s Base64 encoded string
 * @return {String} UTF-8 encoded string
 * @since 1.1.1
 */
function b64toutf8(s) {
  return decodeURIComponent(hextouricmp(b64tohex(s)));
}

// ==== utf8 / hex ================================
/**
 * convert a UTF-8 encoded string including CJK or Latin to a hexadecimal encoded string.<br/>
 * @param {String} s UTF-8 encoded string
 * @return {String} hexadecimal encoded string
 * @since 1.1.1
 */
function utf8tohex(s) {
  return uricmptohex(encodeURIComponentAll(s));
}

/**
 * convert a hexadecimal encoded string to a UTF-8 encoded string including CJK or Latin.<br/>
 * Note that when input is improper hexadecimal string as UTF-8 string, this function returns
 * 'null'.
 * @param {String} s hexadecimal encoded string
 * @return {String} UTF-8 encoded string or null
 * @since 1.1.1
 */
function hextoutf8(s) {
  return decodeURIComponent(hextouricmp(s));
}

/**
 * convert a hexadecimal encoded string to raw string including non printable characters.<br/>
 * @param {String} s hexadecimal encoded string
 * @return {String} raw string
 * @since 1.1.2
 * @example
 * hextorstr("610061") &rarr; "a\x00a"
 */
function hextorstr(sHex) {
    var s = "";
    for (var i = 0; i < sHex.length - 1; i += 2) {
        s += String.fromCharCode(parseInt(sHex.substr(i, 2), 16));
    }
    return s;
}

/**
 * convert a raw string including non printable characters to hexadecimal encoded string.<br/>
 * @param {String} s raw string
 * @return {String} hexadecimal encoded string
 * @since 1.1.2
 * @example
 * rstrtohex("a\x00a") &rarr; "610061"
 */
function rstrtohex(s) {
    var result = "";
    for (var i = 0; i < s.length; i++) {
        result += ("0" + s.charCodeAt(i).toString(16)).slice(-2);
    }
    return result;
}

// ==== hex / b64nl =======================================

/*
 * since base64x 1.1.3
 */
function hextob64(s) {
    return hex2b64(s);
}

/*
 * since base64x 1.1.3
 */
function hextob64nl(s) {
    var b64 = hextob64(s);
    var b64nl = b64.replace(/(.{64})/g, "$1\r\n");
    b64nl = b64nl.replace(/\r\n$/, '');
    return b64nl;
}

/*
 * since base64x 1.1.3
 */
function b64nltohex(s) {
    var b64 = s.replace(/[^0-9A-Za-z\/+=]*/g, '');
    var hex = b64tohex(b64);
    return hex;
}

// ==== URIComponent / hex ================================
/**
 * convert a URLComponent string such like "%67%68" to a hexadecimal string.<br/>
 * @param {String} s URIComponent string such like "%67%68"
 * @return {String} hexadecimal string
 * @since 1.1
 */
function uricmptohex(s) {
  return s.replace(/%/g, "");
}

/**
 * convert a hexadecimal string to a URLComponent string such like "%67%68".<br/>
 * @param {String} s hexadecimal string
 * @return {String} URIComponent string such like "%67%68"
 * @since 1.1
 */
function hextouricmp(s) {
  return s.replace(/(..)/g, "%$1");
}

// ==== URIComponent ================================
/**
 * convert UTFa hexadecimal string to a URLComponent string such like "%67%68".<br/>
 * Note that these "<code>0-9A-Za-z!'()*-._~</code>" characters will not
 * converted to "%xx" format by builtin 'encodeURIComponent()' function.
 * However this 'encodeURIComponentAll()' function will convert
 * all of characters into "%xx" format.
 * @param {String} s hexadecimal string
 * @return {String} URIComponent string such like "%67%68"
 * @since 1.1
 */
function encodeURIComponentAll(u8) {
  var s = encodeURIComponent(u8);
  var s2 = "";
  for (var i = 0; i < s.length; i++) {
    if (s[i] == "%") {
      s2 = s2 + s.substr(i, 3);
      i = i + 2;
    } else {
      s2 = s2 + "%" + stohex(s[i]);
    }
  }
  return s2;
}

// ==== new lines ================================
/**
 * convert all DOS new line("\r\n") to UNIX new line("\n") in
 * a String "s".
 * @param {String} s string
 * @return {String} converted string
 */
function newline_toUnix(s) {
    s = s.replace(/\r\n/mg, "\n");
    return s;
}

/**
 * convert all UNIX new line("\r\n") to DOS new line("\n") in
 * a String "s".
 * @param {String} s string
 * @return {String} converted string
 */
function newline_toDos(s) {
    s = s.replace(/\r\n/mg, "\n");
    s = s.replace(/\n/mg, "\r\n");
    return s;
}


// ----------------- end of libs ---------------


function parseKey(str) {
  var result = new Uint8Array((str.length/2));
  var idx = 0;
  for(var i=0;i<str.length-1;i=i+2) {

    var bte = parseInt(str.substring(i,i+2), 16);
    result[idx] = bte;
    idx++;
  }
  return result;
}

var rawKeyHex = "B09B09D22634C093ADF4BD93258FB9A718A1E5EBE45E09686F90B2F16A5F6012C9914112D7F2C9D6927E4FDD121D7B04B22DD7AD5554A957D0D9EEAF4FD954796F69D69065F77C1BE20F5337323676D51318A33EA912CAFEF58183DE3E064E70F82414E2373286C58EFFE94BF6FF848518A05B94D305C837A46E7BF789F6B1B5";
var rawKey = parseKey(rawKeyHex);
//console.log(rawKey);
//console.log("key b64", hextob64u(rawKeyHex));
jwkKEY = hextob64u(rawKeyHex);

//65537
jwk = {alg: "RS1", e: "AQAB", ext: true,
       key_ops: ["verify"],
       kty: "RSA",
       n: jwkKEY};
console.log(jwk);

//var exKey = new Uint8Array([97, 239, 99, 214, 171, 54, 216, 57, 145, 72, 7, 93, 34, 31, 149, 156]);
//console.log("example", hextob64u(BAtohex(exKey)));

var decoder = new TextDecoder("utf-8");
var encoder = new TextEncoder("utf-8");

var cryptoSubtle = window.crypto.subtle;

var algorithm = {name: 'RSASSA-PKCS1-v1_5', modulusLength: 1024, hash: {name:'SHA-1'}};
var extractable = true;
var usages = ["verify"];

cryptoSubtle.importKey('jwk', jwk, algorithm, extractable, usages)
.then(function(key) {

console.log("Key imported: ", key);

  // signature for: 123
/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1

123
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1

iJwEAQECAAYFAlTqoOgACgkQU8OoVg0YM0XtbgP8DXcG5bRpFZ/zM/5I49tD1q1b
ofhL/0c4WrjJkGHHGBfrKQ48zMPAm0HHxxY3vAGOg5GwN2HAd6z0/td4WXRhTO5n
cIHXqCCAMaiLaLkgAKNPkdm/EciWn0Ao1ot+a6zmY36dciqkpR5nE5HK0VlCoT9n
+RV3hESHDVuYmw5YoRE=
=txZ+
-----END PGP SIGNATURE-----
*/
// sig decoded in hex
/*
a3019bc0cbccc0c4187c784518af84b12be369ae248690578b390d8d8cb9
3ae6b030303231b0b132814418b8380560ca7e1bb3304cef14f5f5b7cf12
732aeabe74c573c6fedfa9d26fba2f95cb58867672b0dd560b3b6bfce2b3
e39c5d9faed6d58be7ca3fea101434b0b17cfe7febf3a3ad3bd91e34a62e
a89fa91efcd93e2af3a3cd9f85da1eec51fcec9fac7e2dd72b945cf12e90
d19e3122f08128cfba7773a7a8c666c9abf789cd3bf768dbcd9486941bdb
d4c56dc305360100
*/

  var rawSig = "3324cc8cbae289e09d797c075cabe4a221dfda0861e9d36ee4f4753d4ad198c87379a1d3e4def9d66fbdf2dd99ca480b73c69290cd3f9cba84859b94f3f4f72e53ba1eecebb4b1bbef624d7818ceba2245d16a2e26a0ca2d7e273c7fc8d3dc02d313da7b230f49176652de852bb14c8bc0b800b4dab7fbcd6ad3fabd4e75f6d1";
  var sig = parseKey(rawSig);
  console.log("Signature:", sig);

  //var data = encoder.encode("123");
  var data = new Uint8Array([49,50,51,10]);
  console.log(data);

    cryptoSubtle.verify(algorithm, key, sig.buffer, data.buffer)
    .then(function(result) {
      console.log("Signature is:", result);
    });

});