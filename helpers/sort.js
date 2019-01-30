export default function sort(a, b) {
    const numA = a.highScore || 0;
    const numB = b.highScore || 0;
    let comparison = 0;
    
    if (numA >= numB) {
        comparison = -1;
    } else if (numA < numB) {
        comparison = 1;
    }
    return comparison;
}
