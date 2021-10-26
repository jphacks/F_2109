exports.checkPixel = async function (correct_filename, temp_filename, diff_filename){
    let all_pixel
    let score;
    const origin_width = 1200;
    const origin_height = 3329;
    const { imgDiff } = require("img-diff-js");
    await imgDiff({
        actualFilename: correct_filename,
        expectedFilename: temp_filename,
        diffFilename: diff_filename,
    }).then(result => {
        console.log(result);
        all_pixel = origin_width * origin_height;
        score = (all_pixel - result.diffCount) / all_pixel;

    });
    //console.log(score);
    return score;
}