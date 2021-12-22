import React from 'react';
import Home from '../../pages/demo/Home';
import Reports, { Report1, Report2, Report3 } from '../../pages/demo/Reports';
import Products from '../../pages/demo/Products';
import { Route, Switch } from 'react-router';
import NotFound from '../../pages/notfound/NotFound';
function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/home" component={Home}></Route>
        <Route path="/reports" exact component={Reports} />
        <Route path="/reports/report1" component={Report1} />
        <Route path="/reports/report2" component={Report2} />
        <Route path="/reports/report3" component={Report3} />
        <Route path="/products" component={Products} />
        <Route component={NotFound}></Route>
      </Switch>
    </main>
  );
}

export default Main;
