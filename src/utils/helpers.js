export const filterUsersByDate = (users)=>{
    const now = new Date();

    // last 24 hrs = oneDayAgo
    const oneDayAgo = new Date();
    oneDayAgo.setDate(now.getDate()-1);
    // last 7 days = oneWeekAgo
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate()-7);
    // one Month ago 
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth()-1);
    // three month ago
    const threeMonthAgo = new Date();
    threeMonthAgo.setMonth(now.getMonth()-3);
    // six Month ago 
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(now.getMonth()-6);
    // year ago
    const yearAgo = new Date();
    yearAgo.setMonth(now.getMonth()-12);

    const usersWithinDay = users.filter(user=>{
      const subscriptionDate = new Date(user.subscriptionDate);
      return subscriptionDate >= oneDayAgo && subscriptionDate <= now;
    });

    const usersWithinWeek = users.filter(user=>{
      const subscriptionDate = new Date(user.subscriptionDate);
      return subscriptionDate >= oneWeekAgo && subscriptionDate <= now;
    });

    const usersWithinMonth = users.filter(user=>{
      const subscriptionDate = new Date(user.subscriptionDate);
      return subscriptionDate >= monthAgo && subscriptionDate <= now;
    });

    const usersInThreeMonths = users.filter(user=>{
      const subscriptionDate = new Date(user.subscriptionDate);
      return subscriptionDate >= threeMonthAgo && subscriptionDate <= now;
    });

    const usersInSixMonths = users.filter(user=>{
      const subscriptionDate = new Date (user.subscriptionDate);
      return subscriptionDate >= sixMonthAgo && subscriptionDate <= now;
    });

    const usersWithinYear = users.filter(user=>{
      const subscriptionDate = new Date( user.subscriptionDate);
      return subscriptionDate >= yearAgo && subscriptionDate <= now;
    })

    return { usersWithinDay , usersWithinWeek , usersWithinMonth , usersInThreeMonths , usersInSixMonths , usersWithinYear};
}