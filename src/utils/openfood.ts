const DEV_URL = "https://world.openfoodfacts.net";
const PROD_URL = "https://world.openfoodfacts.org";

export async function getProductInfoFromBarcode(barcode: string) {
    // 4056489043379
    const url = `${DEV_URL}/api/v2/product/${barcode}.json`;
    let resp: Response;
    try {
        resp = await fetch(url, {
            headers: {
                UserAgent: "Freezapp/v0.0.1 (d.jozwik@campus.fct.unl.pt) | Student project for IPM course",
                Accept: "application/json",
                Authorization: `Basic: ${btoa("off:off")}`,
            },
        });
    } catch (err) {
        console.error("cannot request openfood api data:", err);
        return;
    }

    const json = await resp.json();
    console.log(json);
}
