import FileResizer from "react-image-file-resizer";

export default abstract class Helpers{
    public static resizeFile = (file: Blob, doc: boolean) =>
    new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file,
        doc ? 1000 : 444,
        doc ? 1000 : 444,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file",
        doc ? 1000 : 444,
        doc ? 1000 : 444,
      );
    });

    public static getGiveawayIcon(label: string){
      switch (label) {
        case "un infuseur à thé":
            return 0;
        case "une boite de 100g d’un thé détox ou d’infusion":
           return 1;

        case "une boite de 100g d’un thé signature":

            return 2;

        case "un coffret découverte d’une valeur de 39€":
           return 3;
        case "un coffret découverte d’une valeur de 69€":
            return 4;
            
        default:
          return 0
      }
    }
}
