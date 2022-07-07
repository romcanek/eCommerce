import { useQuery } from "@apollo/client";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { GET_ITEMS } from "../queries/itemQueries";
import ItemCard from "./ItemCard";

function Items({ filter }) {
    const { loading, error, data } = useQuery(GET_ITEMS);
    const [filteredItems, setFilteredItems] = useState(null);

    const PriceNumber = (price) => {
        return Number(price.replace("Kč", "").replace(" ", ""));
    };

    /* využije pouze admin */
    useEffect(() => {
        if (!loading && !error) {
            setFilteredItems([...data.items]);
        }
    }, [data, loading]);

    /* filtrování */
    useEffect(() => {
        if (!loading) {
            setFilteredItems([...data.items]);
            if (filter === "nejlevnější") {
                setFilteredItems([
                    ...filteredItems.sort(
                        (a, b) => PriceNumber(a.price) - PriceNumber(b.price)
                    ),
                ]);
            } else if (filter === "nejdražší") {
                setFilteredItems([
                    ...filteredItems.sort(
                        (a, b) => PriceNumber(b.price) - PriceNumber(a.price)
                    ),
                ]);
            } else if (filter === "značka") {
                setFilteredItems([
                    ...filteredItems.sort((a, b) => a.name.localeCompare(b.name)),
                ]);
            }
        }
    }, [loading, filter]);

    /* pagination */
    const [page, setPage] = useState(1);
    const handlePageChange = (e, p) => {
        setPage(p);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong</p>;

    return (
        <>
            {filteredItems?.length > 0 ? (
                filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
                <p>No items found</p>
            )}
            <Pagination
                color="primary"
                count={Math.ceil(data?.items.length / 20)}
                page={page}
                onChange={handlePageChange}
                sx={{ gridColumn: "1 / -1", margin: "auto", marginTop: "2em" }}
            />
        </>
    );
}

export default Items;
