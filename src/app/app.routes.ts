import { Routes } from '@angular/router';
import { BrandComponent } from './products/brand/brand.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { roleGuard } from './core/services/role.guard';
import { authGuard } from './guard/auth.guard';
import { MainComponent } from './home/main/main.component';
// import { MainComponent } from './home/main/main.component';
// import { CartComponent } from './products/cart/cart.component';
// import { NotFoundComponentComponent } from './core/components/not-found-component/not-found-component.component';
// import { LoginComponent } from './auth/login/login/login.component';
// import { RegisterComponent } from './auth/signup/register/register.component';
// import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
// import { UserProfileComponent } from './profile/user-profile/user-profile.component';
// import { UpdateprofileComponent } from './profile/updateprofile/updateprofile.component';
// import { CompareComponent } from './products/compare/compare.component';
// import { WishlistComponent } from './products/wishlist/wishlist.component';
// import { OtherinfoComponent } from './admin/otherinfo/otherinfo.component';
// import { ProductsearchComponent } from './products/productsearch/productsearch.component';
// import { CheckoutComponent } from './products/checkout/checkout.component';
// import { OrdersComponent } from './admin/orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    // loadComponent: () =>
    //   import('./home/main/main.component').then((m) => m.MainComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [roleGuard],
    data: { role: ['user', 'admin'] },
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./products/productsearch/productsearch.component').then(
        (m) => m.ProductsearchComponent
      ),
  },
  { path: 'brand/:brandName', component: BrandComponent },
  { path: 'product/:id', component: ProductDetailsComponent }, // Dynamic route for product details
  {
    path: 'cart',
    loadComponent: () =>
      import('./products/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./products/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./products/compare/compare.component').then(
        (m) => m.CompareComponent
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./products/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./profile/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./profile/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    canActivate: [roleGuard],
    data: { role: 'user' },
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./admin/customers/customers.component').then(
        (m) => m.CustomersComponent
      ),
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'updateuserprofile',
    loadComponent: () =>
      import('./profile/updateprofile/updateprofile.component').then(
        (m) => m.UpdateprofileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'crudproducts',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./admin/orders/orders.component').then((m) => m.OrdersComponent),
    canActivate: [roleGuard],
    data: { role: ['user', 'admin'] },
  },
  {
    path: 'userOrders',
    loadComponent: () =>
      import('./products/user-orders/user-orders.component').then(
        (m) => m.UserOrdersComponent
      ),
  },
  {
    path: 'otherinfo',
    loadComponent: () =>
      import('./admin/otherinfo/otherinfo.component').then(
        (m) => m.OtherinfoComponent
      ),
    canActivate: [roleGuard],
    data: { role: 'admin' },
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        './core/components/not-found-component/not-found-component.component'
      ).then((m) => m.NotFoundComponentComponent),
  },
];
