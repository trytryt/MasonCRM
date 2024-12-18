class CustInFollow {
    public followedId: number
    public customerId: number;
    public status: boolean;
  
   

    public constructor(customer: CustInFollow) {
        this.followedId = customer.followedId
        this.customerId = customer.customerId
        this.status = customer.status
    
    }

  
}

export default CustInFollow;