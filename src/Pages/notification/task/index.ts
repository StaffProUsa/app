import { SPage } from "servisofts-component";
import Model from "../../../Model";
import _new from "./new";
// import profile from "./profile/index";
import calendar from "./calendar";
import edit from "./edit";

const model = Model.notification_task;

export const Parent = {
    name: "task",
    path: `/notification/task`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": calendar,
    "calendar": calendar,
    "new": _new,
    "edit": edit,
})