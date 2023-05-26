export function SortUniqueNumbers(arr:number[]) {
    if (arr.length === 0) return arr;
    arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
        if (arr[i - 1] !== arr[i]) {
            ret.push(arr[i]);
        }
    }
    return ret;
}