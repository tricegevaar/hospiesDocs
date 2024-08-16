import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bulb } from '../../models/bulb.model';
import { BackendService } from '../../services/backend.service';
import { UserBulb } from '../../models/userBulb.model';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-dedications',
    templateUrl: './dedications.component.html',
    styleUrls: ['./dedications.component.css'],
})
export class DedicationsComponent implements OnInit {
    dedicationTreeGlobes: any[];

    searchName = '';

    globeTitle = '';

    globeFor = '';

    boughtBy = '';

    message = '';

    treeUrl = '';

    globesDonated = 0;

    constructor(
        private meta: Meta,
        private title: Title,
        private afs: AngularFirestore,
        private bs: BackendService,
        private toaster: ToastrService
    ) {}

    ngOnInit() {
        this.title.setTitle('Dedications - Tree of Light : HospiceWits');

        this.meta.addTag({ property: 'og:url', content: 'https://www.tree-of-light.co.za/dedications' });

        this.meta.addTag({ property: 'og:type', content: 'article' });

        this.meta.addTag({ property: 'og:title', content: 'this will be globe title' });

        this.meta.addTag({ property: 'og:description', content: 'this will be the dedication messafe' });

        this.meta.addTag({ property: 'og:image', content: 'http://via.placeholder.com/300' });

        this.showGlobes();
    }

    private showGlobes(): void {
        this.bs.showGlobesOnTree().subscribe(treeGlobes => {
            this.dedicationTreeGlobes = [];

            treeGlobes.forEach(a => {
                const globe: any = a.payload.doc.data();

                globe.id = a.payload.doc.id;

                this.dedicationTreeGlobes.push(globe);
            });

            this.globesDonated = this.dedicationTreeGlobes.length;
        });
    }

    private showGlobeDetails(globe: any): void {
        this.globeTitle = globe.tol + '  ' + globe.forWho;

        this.boughtBy = globe.title;

        this.globeFor = globe.forWho;

        this.message = globe.message;

        this.treeUrl = globe.treeUrl;
    }

    private searchGlobeFromTree(name: string): void {
        this.dedicationTreeGlobes = [];

        this.bs.findTreeGlobe(name.toUpperCase().trim()).subscribe(foundGLobes => {
            if (foundGLobes.length === 0) {
                this.toaster.warning('No globe found for ' + name, 'No Globe');

                this.showGlobes();
            } else {
                this.dedicationTreeGlobes = [];

                foundGLobes.forEach(a => {
                    const globe: any = a.payload.doc.data();

                    globe.id = a.payload.doc.id;

                    this.dedicationTreeGlobes.push(globe);
                });
            }
        });
    }

    private searchGlobeByTitle(title: string): void {
        this.bs.showGlobesByTitle(title).subscribe(globesByTitle => {
            if (globesByTitle.length === 0) {
                this.toaster.warning('No globes for ' + title + ' available yet', 'No Globes');

                this.showGlobes();
            } else {
                this.dedicationTreeGlobes = [];

                globesByTitle.forEach(a => {
                    const globe: any = a.payload.doc.data();

                    globe.id = a.payload.doc.id;

                    this.dedicationTreeGlobes.push(globe);
                });
            }
        });
    }
}
