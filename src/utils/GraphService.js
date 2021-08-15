const graphQLFetcher = (graphQLParams) => {
  console.log("GRAPH QL FETCHER", graphQLParams);
  return fetch("http://localhost:8000/subgraphs/name/scaffold-eth/posts", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(graphQLParams),
  }).then((response) => response.json());
};

export default class GraphService {

    constructor(){
      this.fetcher = graphQLFetcher;
      window.gf = graphQLFetcher;
    }

    async fetchClubs() {
        return await graphQLFetcher({
            query: `{
              locks(first: 25, orderBy: createdAt, orderDirection: desc) {
                id
                name
                price
                owner
                createdAt
              }
            }
            `
          }).then((data) => {
            return data.data.locks.map(l => {
              l.address = l.id;
              return l;
            });
          });
    }


  async fetchAllPosts(clubAddress) {
    return await graphQLFetcher({
      query: `
            posts(first: 25, where:{lock: {id: ${clubAddress}}}) {
              id
              sender
              description
              filepath
              createdAt
            }
          `,
    }).then((data) => {
      return data.data.posts;
    });
  }

  async fetchClubsOfMember(memberAddress) {
    return await graphQLFetcher({
      query: `{
        members(first: 25, orderBy:createdAt, orderDirection: desc) {
          id
          pubkey
          lock {
            id
            name
          }
        }
      }
      `
    }).then((data) => {
      return data.data.members.map(m => ({
        address: m.lock.id,
        id: m.id,
        pubkey: m.pubkey,
        name: m.lock.name
      }));
    });
    // return [
    //   {
    //     address: "0x814002Ca045c012E396273305150042b58BA06E3",
    //   },
    // ];
  }

    async fetchOwnedClub(ownerAddress) {
      return await graphQLFetcher({
        query: `{
          locks(first: 25, orderBy:createdAt, orderDirection: desc, where: {owner: "${ownerAddress.toLowerCase()}"}) {
            id
            name
            price
            createdAt
          }
        }
        `
      }).then((data) => {
        if(data.data.locks.length > 0){
          data.data.locks[0].address = data.data.locks[0].id;
          return data.data.locks[0];
        } else {
          return null;
        }
      });
      // return {
      //   name: "third Club",
      //   address: "0xd1F90d85a4a99D7042F6C601407Aa1E9f0E7CEB6"
      // };
    }


  async fetchMembersOfClub(clubAddress) {
    return await graphQLFetcher({
      query: `{
        members(first: 25, orderBy:createdAt, orderDirection: desc, where: { lock : "${clubAddress.toLowerCase()}"}) {
          id
          pubkey
          address
          lock {
            id
          }
        }
      }
      `
    }).then((data) => {
      return data.data.members;
    });
    
    // return [
    //   {
    //     address: "0x53ACaa360010Ffd3c8D444D1e3411F9d944F2aba",
    //     pubkey: "vb+Wj1tgO7l4wDHI6XOllO/XEhdy7KqsmR7MjitXxX8=",
    //   },
    // ];
  }

  async fetchPostsForClub(clubAddress) {
    return await graphQLFetcher({
      query: `{
        posts(first: 25, orderBy:createdAt, orderDirection: desc, where: { lock : "${clubAddress.toLowerCase()}"}) {
          id
          sender
          description
          filepath
          createdAt
        }
      }
      `
    }).then((data) => {
      return data.data.posts;
    });

    // return [
    //   {
    //     id: "",
    //     filepath: "BEST CLUB/test1.png_md",
    //     description: "Test File",
    //   },
    // ];
  }
}
