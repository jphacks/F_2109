exports.checkPixel = async function (correct_filename, temp_filename, diff_filename){
    let all_pixel
    let score;
    const { imgDiff } = require("img-diff-js");
    await imgDiff({
        actualFilename: correct_filename,
        expectedFilename: temp_filename,
        diffFilename: diff_filename,
    }).then(result => {
        console.log(result);
        all_pixel = result.width * result.height;
        score = (all_pixel - result.diffCount) / all_pixel;

    });
    //console.log(score);
    return score;
}