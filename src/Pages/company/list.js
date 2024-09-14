import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SImage, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PBarraFooter from '../../Components/PBarraFooter';

class index extends DPA.list {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "estado"],
            // params: ["key_evento"],
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
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" });
    }
    $filter(data) {
        return data.estado != 0
    }

    $item(obj) {
        return <SView col={"xs-12"} padding={8} row onPress={super.$onSelect.bind(this, obj)} style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <SView width={40} height={40} style={{
                borderRadius: 4,
                overflow: 'hidden',
            }}>
                <SImage src={SSocket.api.root + "company/" + obj.key} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SText bold fontSize={16}>{obj.descripcion}</SText>
                <SText color={STheme.color.lightGray}>{obj.observacion}</SText>
            </SView>
        </SView>
    }
    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        return Parent.model.Action.getAll({});
    }

    // $footer() {
    //     return <PBarraFooter style={{
    //         position: "absolute",
    //         bottom: 0,
    //     }} url={'/company'} />
    // }
}
export default connect(index);