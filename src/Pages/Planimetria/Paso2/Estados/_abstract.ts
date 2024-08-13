import React from 'react';

export default abstract class index {

    name;
    Menu;
    ref;
    colors = {
        base: "#0000ff",
        card: "#0000ff22"
    }
    constructor(name, Menu) {
        this.name = name;
        this.Menu = Menu;
    }
    abstract render();

    setValue(obj) {
        this.Menu.state[this.name] = obj;
        this.Menu.repaint();
    }
    clear() {
        this.Menu.state[this.name] = null;
    }
    paint(ref) {
        this.ref = ref;
        const { ctx } = ref;


    }
    onClick(evt, ref) {
        this.ref = ref;

    }

}