// https://date-fns.org/
import { format } from "date-fns";

// "PPP" is a shorthand for a long, localized date format. It is equivalent to "do MMMM yyyy"
const FormattedDate = ({ date = new Date(), dateFormat = "PPP" }) => {
    try {
        return <span>{format(new Date(date), dateFormat)}</span>;
    } catch (error) {
        return <span>Invalid date</span>;
    }
};

export default FormattedDate;