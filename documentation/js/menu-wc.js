'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nosconformes-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' : 'data-target="#xs-controllers-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' :
                                            'id="xs-controllers-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' : 'data-target="#xs-injectables-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' :
                                        'id="xs-injectables-links-module-AuthModule-fd43a41e9d10d98a40585b48dff272e1b02ac8ca1969e4a9ad6ab1db8fe934f26557b2ff4ab825c15544e3f505f6344e0b046b0959b361695e3ec29db70b90f1"' }>
                                        <li class="link">
                                            <a href="injectables/ChangePasswordService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangePasswordService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoginService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompaniesModule.html" data-type="entity-link" >CompaniesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' : 'data-target="#xs-controllers-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' :
                                            'id="xs-controllers-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' }>
                                            <li class="link">
                                                <a href="controllers/CompaniesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompaniesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' : 'data-target="#xs-injectables-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' :
                                        'id="xs-injectables-links-module-CompaniesModule-08515cf7d5c5fb268a06fe73213343df1fed54095959bf031e7e578d25ffd8523d5706b8a2e1b4813ee5607adc547d7e27906ebd6587c0750a1e114a1f0c3ec5"' }>
                                        <li class="link">
                                            <a href="injectables/CreateCompanyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateCompanyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindCompaniesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindCompaniesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EncriptationModule.html" data-type="entity-link" >EncriptationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' : 'data-target="#xs-controllers-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' :
                                            'id="xs-controllers-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' : 'data-target="#xs-injectables-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' :
                                        'id="xs-injectables-links-module-UsersModule-8c4c588557cefdb4509bb5005e2207484d249389b763e98f32234ed13b5bb3c547ffcc0328df2810767b7593ff8c1ca0e02ef664210da7d4e8384a5b45ff58dc"' }>
                                        <li class="link">
                                            <a href="injectables/CreateUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FindUsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FindUsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Company.html" data-type="entity-link" >Company</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BCryptProvider.html" data-type="entity-link" >BCryptProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCompaniesTable1672866368425.html" data-type="entity-link" >CreateCompaniesTable1672866368425</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUsersTable1672782049384.html" data-type="entity-link" >CreateUsersTable1672782049384</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ChangePasswordService.html" data-type="entity-link" >ChangePasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateCompanyService.html" data-type="entity-link" >CreateCompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateUserService.html" data-type="entity-link" >CreateUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FindCompaniesService.html" data-type="entity-link" >FindCompaniesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FindUsersService.html" data-type="entity-link" >FindUsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link" >LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link" >LoginService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});