import { SPage, SPageListProps } from 'servisofts-component';
import root from './root';
import genero from './genero';
import foto from './foto';
import categorias from './categorias';
export const Parent = {
    name: "registro",
    path: `/registro`,
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "genero": genero,
    "foto": foto,
    "categorias": categorias,
});