

import Group, { ReactComponent as GroupW } from './group.svg';
import Ticket, { ReactComponent as TicketW } from './ticket.svg';
import Cart, { ReactComponent as CartW } from './cart.svg';

const Assets = {
	"Ticket": { Native: Ticket, Web: TicketW },
	"Group": { Native: Group, Web: GroupW },
	"Cart": { Native: Cart, Web: CartW },
}

export default Assets;