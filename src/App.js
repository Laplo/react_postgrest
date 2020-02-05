import React, {useState, useEffect} from 'react';
import './App.css';
import {PostgrestClient} from '@supabase/postgrest-js';
import InfiniteScroll from 'react-infinite-scroller';

const App = () => {

    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const client = new PostgrestClient('http://localhost:4000');

    /*
    useEffect(() => {
        for (let i = 0; i < 50; i++) {
            client
                .from('omega')
                .insert([{
                    username: 'bulk' + i,
                    firstname: 'bulkf' + i,
                    lastname: 'bulkl' + i
                }])
                .then(res => {
                    console.log(res);
                })
                .catch(e => {
                   console.log(e);
                });
        }
    }, []); */

    const loadUsers = range => {
        console.log('range');
        console.log(range);
        const rangeStart = ((range * 5) - 5);
        console.log(rangeStart);
        const rangeEnd = (range * 5);
        console.log(rangeEnd);
        client
            .from('omega')
            .single()
            .select('*')
            .range(rangeStart, rangeEnd)
            .then(res => {
                if (res.body.length === 0) {
                    console.log('no more');
                    setHasMore(false);
                    return;
                }
                const newUsersArray = users.concat(res.body);
                console.log(newUsersArray);
                setUsers(newUsersArray);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const loader = <div className="loader">Loading ...</div>;
    const items = [];
    users.forEach((user, i) => {
        items.push(
            <div className="track" key={i} style={{width:'200px', height:'200px'}}>
                <section>
                    <p>
                        {user.username} - {user.firstname} - {user.lastname}
                    </p>
                </section>
            </div>
        );
    });

    return (
        <div className="App">
            <InfiniteScroll
                pageStart={0}
                loadMore={loadUsers.bind(this)}
                hasMore={hasMore}
                loader={loader}>
                <div className="tracks">
                    {items}
                </div>
            </InfiniteScroll>
        </div>
    );

};

export default App;
