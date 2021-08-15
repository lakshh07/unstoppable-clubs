
const graphQLFetcher =  (graphQLParams) => {
    console.log('GRAPH QL FETCHER', graphQLParams);
    return fetch("", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }


export default class GraphService {

    constructor(){
      this.fetcher = graphQLFetcher;
    }

    async fetchClubs() {
        // return await graphQLFetcher({
        //     query: `
        //       locks(first: 25) {
        //         id
        //         name
        //         price
        //       }
        //     `
        //   }).then((data) => {
        //     return data.data.locks;
        //   })
        return [
            {
                name: "NBEST CLUB",
                address: "0x814002Ca045c012E396273305150042b58BA06E3",
                price: "0.1"
            },
            {   
                name: "SECOND BEST",
                address:"0x84b222F577F99E07C0f7F7D91fBBb67d051E5229",
                price: "0.1"
            },
            {
              name: "third Club",
              address: "0xd1F90d85a4a99D7042F6C601407Aa1E9f0E7CEB6",
              price: "0.1"
            }
        ]
    }

    async fetchAllPosts (clubAddress) {
        return await graphQLFetcher({
          query: `
            posts(first: 25, where:{lock: {id: ${clubAddress}}}) {
              id
              sender
              description
              filepath
              createdAt
            }
          `
        }).then((data) => {
          return data.data.posts;
        })
      }

    async fetchClubsOfMember(memberAddress) {
        return [
            {
                address: "0x814002Ca045c012E396273305150042b58BA06E3"
            }
        ]
    }

    async fetchOwnedClub(ownerAddress) {
      return {
        name: "third Club",
        address: "0xd1F90d85a4a99D7042F6C601407Aa1E9f0E7CEB6"
      };
    }

    async fetchAllClubsOfMember  (memberAddress) {
        return await graphQLFetcher({
          query: ` {
            posts(first: 25, where:{lock: {id: ""}}) {
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
        })
    
      }
    async fetchMembersOfClub(clubAddress) {
      return [{
        address: "0x53ACaa360010Ffd3c8D444D1e3411F9d944F2aba",
        pubkey: "vb+Wj1tgO7l4wDHI6XOllO/XEhdy7KqsmR7MjitXxX8="
      }]
    }

    async fetchPostsForClub(clubAddress) {
      return [
        {
          id: "",
          filepath: "BEST CLUB/test1.png_md",
          description: "Test File"
        }
      ]
    }
          

}