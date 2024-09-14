import React, { Component } from 'react';
import { SExcel, SNavigation } from 'servisofts-component';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';

class index extends DPA.list {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "Password", "Telefono", "Correo", "CI", "papeles","nivel_ingles"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
    }


    $allowNew() {

        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table" });
    }
    $allowAccess() {
        return true;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" });
    }
    onNew(){
        SNavigation.navigate(Parent.path + "/add")
    }
    $menu() {
        var menu = super.$menu();
        // menu.push({
        //     label: "Add", onPress: () => {
        //         SNavigation.navigate(Parent.path + "/add")
        //     }
        // })
        if (Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "show_deleted" })) {
            menu.push({
                label: "Eliminados", onPress: () => {
                    console.log(Parent.path)
                    SNavigation.navigate(Parent.path + "/eliminados")
                }
            })
            menu.push({
                children: <SExcel
                    name={"Plan de cuentas calistenia"}
                    data={this.data}
                    styleHeader={{ width: 400, }}
                    header={[
                        { key: "codigo", label: "Codigo", type: "s", style: { width: 100 } },
                        { key: "descripcion", label: "Descripcion", type: "s", style: {} },
                        { key: "fecha_on", label: "Fecha creacion", type: "d", style: { width: 170 }, styleData: { alignment: { horizontal: "center" } } },
                        { key: "estado", label: "Estado", type: "n", style: { width: 100 }, styleData: { alignment: { horizontal: "center" } } },
                        { key: "key", label: "key", style: { width: 130 }, type: "s", styleData: { alignment: { horizontal: "center" }, font: { sz: 6 }, } },

                    ]} />
            })
        }

        return menu;
    }
    $order() {
        return [{ key: "Nombres", order: "asc", peso: 2 }, { key: "Apellidos", order: "asc", peso: 1 }]
    }
    $filter(data) {
        // return true;
        return data.estado != "0"
    }
    $getData() {
        // let eu = Model.empresa_usuario.Action.getAllByKeyEmpresa(Model.empresa.Action.getKey());
        let usuarios = Parent.model.Action.getAll({});
        // console.log(eu);
        // if (!eu || !usuarios) return null
        // let data = Object.values(eu).map(a => {
        // let usr = usuarios[a.key_usuario];
        // usr.empresa_usuario = a;
        // return usr;
        // })
        return usuarios;
    }
}
export default connect(index);