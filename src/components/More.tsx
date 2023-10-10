import React, { MouseEventHandler } from 'react';
import Button from 'react-bootstrap/Button';



interface MoreProps {
    pagination: {
        offset: number;
        count: number;
        total: number;
    };
    loadNextPage: MouseEventHandler<HTMLButtonElement>;
}

const More = ({ pagination, loadNextPage }: MoreProps) => {
    let thereAreMore = false;

    if (pagination) {
        const { offset, count, total } = pagination;
        thereAreMore = offset + count < total;
    }

    return (
        <div className="More">
            {thereAreMore &&
                <Button variant="outline-primary" onClick={loadNextPage}>
                    More &raquo;
                </Button>
            }
        </div>
    );
};

export default More;