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
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_company"],
            // itemType: "0",
            params: ["key_company?"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
    }
    $allowNew() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new", user_data: { key_company: this.$params.key_company } });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table", user_data: { key_company: this.$params.key_company } });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver", user_data: { key_company: this.$params.key_company } });
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
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key} />
            </SView>
            <SView width={8} />
            <SView flex style={{ justifyContent: "center" }}>
                <SText bold fontSize={16}>{obj.descripcion}</SText>
                {/* <SText color={STheme.color.lightGray}>{obj.observacion}</SText> */}
            </SView>
        </SView>
    }
    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        return Parent.model.Action.getAll({ key_company: this.$params.key_company });
    }
}
export default connect(index);