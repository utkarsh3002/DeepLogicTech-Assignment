const storiesData=(stories)=> {
    let finalArray = [];
    stories.forEach(element => {
        let f = element.replace('line">', "");
        let s = f.replace('</h3>', "");
        let t = s.replace(/<(.*?)>/g, "");
        finalArray.push(t);

    });
    return finalArray
}
module.exports=storiesData;
