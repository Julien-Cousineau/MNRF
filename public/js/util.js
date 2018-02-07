exports.extend = function (dest, src) {
    for (var i in src) dest[i] = src[i];
    return dest;
};