import mitt from "mitt";
import {ShowToastOptions} from "@/types/eventBus.ts";

type Events = {
    showToast: ShowToastOptions
};

export const cornMitt = mitt<Events>();

export default cornMitt;
