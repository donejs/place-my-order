import $ from 'jquery';
import 'less/styles.less!';
import main from './main.stache!';

$(() => {
  $('body').append(main());
});
