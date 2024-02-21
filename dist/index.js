"use strict";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
const PORT = process.env.PORT || 5000;
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log('listening on port 5000'));
}).catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map