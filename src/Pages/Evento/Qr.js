import React from 'react';
import { connect } from 'react-redux';
import {
  SHr,
  SIcon,
  SImage,
  SLoad,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import ImgSaveGallery from '../../Components/ImgSaveGallery';
import ImgShared from '../../Components/ImgShared';
import venta from '../../Services/Casagrandeadmin/Components/venta';
import orden_pago from '../../Services/Casagrandeadmin/Components/orden_pago';
import VerificarOrden from '../../Components/Orden';
// import parametro from '../../Services/Casagrandeadmin/Components/parametro';
import ContadorTiempo from './Components/ContadorTiempo';
import { SStorage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';

// import {
//   FacebookShareButton,
//   WhatsappShareButton,
//   WhatsappIcon,
//   FacebookIcon
// } from 'react-share';

// import Carrito from '../Components/Carrito';
// import PButtomFooter from '../../../../../Components/PButtomFooter';

//todo cuando esto es pago qr, al volver atras, llevar al inicio si o si

class Qr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.name = SNavigation.getParam('nombre');
    this.nit = SNavigation.getParam('nit');
    this.key_venta = SNavigation.getParam('key');
  }

  componentDidMount() {

    // SSocket.sendPromise({
    //   component: "venta",
    //   type: "pago_qr",
    //   key_usuario: Model.usuario.Action.getKey(),
    //   key_venta: this.key_venta,
    //   descripcion: "Pago por compra en app.",
    //   razon_social: "S/N",
    //   nit: "S/N",
    //   monto: 1,
    //   correos: []
    // }).then(e => {
    //   this.setState({ qr: e?.data?.qrImage })
    // }).catch(e => {

    // })
  }
  convertBase64ToBlob() {
    let base64 =
      'iVBORw0KGgoAAAANSUhEUgAAAHoAAABDCAYAAABTLBGBAAAACXBIWXMAAAWJAAAFiQFtaJ36AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACNTSURBVHgB7V13eBVV2j/3pkIqhKqUSECasEFYQMSl7IeCAhaKn67rwq4KrAioH7K7KEUBy36rKAIqKs22IiLr0l1BjBAESSxIJ4SWXm96cu/s7zc5EyaTmbk3yeXxH97nOZm5M3Pqe95y3vc9Jw5hA4qiROMyFOlOeY2WSYOzMn2FtMbhcJy1KMqBsobg+gdxZWAt6t5j9RJ1O3B51+L1q8ibLHwDR35+fnRUVNTLwn+wFmkP2qD+QFuX4hIl/AObUe5ntl+gwvlIeUr9YDdSrKEcItlRUVHxR+UKQVVV1WSlGpl1YMGCBU753hTcbvdCfOYQvoGjtLS0k+JHYNvYRrZ/woQJAbimKH4C2Ten0P4YEBOLlMQxErWp1xcYipSC/PP1RQ4bNiygqKgoSFwhKCwsDGYdZu+OHDlCJE6yyut0OmcMHTo0QPgAQIgjOTk5RPgR2HYieuHChY79+/cHAzk+tcUXwKQM6tu3r1qe0/DiOlx2I8WLxsECIHsWb8A6HFlZWc7i4uIrhmiXyxXMOozPSSUvvPBCXEBAwG9sskdv3LhxmGLBEfRAhKSlpQULPwLHpWfPnmrbQQwhvrTDVygvLw/Myckhoh2BuueO0NBQUmKsWaaUlJTtiYmJCbt27ToF3CmYKW179erVuV+/fuObNGnSxiTLK2DXXwUFBSUT2efOnUvDs39XVlYGWjXsuuuuG2l8BtZWdP78+QSrPCi/KjU1NQ2dqjNApJInnnhiiPAC4eHhD+Lb/+BWsfsOlC88Ho/T7J23dpoB237x4sWatkP+O1C+KaI5/qIegMntxuQ/cfbsWbU8bdCpZHQSFsrSvn37XhsyZMhH6EwVfrqRlPXr15/CNXHAgAFbtm7d+lpEREQXYz6wxVkYwMm8HzFixD4g+RRSk8DAQFbOVDOwKJryqQ6i8X3R9ddfvwi3Hvmd+hxlaPelTZs2zcQkqYMkUGDAM88887TwAhjwMWPHjo3B91migaBrJ+WuwvbpQdfumn5j/pciX5b2G0qeZfmdOnVajLweYZiMLFerS7snIaLcchBgVmxsrAJkK/rZeaNZBSD9JMzkdSgkBz/TwsLCLjFhcNJQWMa33357fs6cOU+Z5QWi78TgsRVucItifJ8TEhKShdmWiZTBK8rlb3Y2z6IMD1Ievsnm93iUyTKQT71HZ3JLACjfiGgHKKwP8nYQXgADE9WtW7c/kDXbfbdnzx7Ld2wn2pTPvqB97JeaZF8z0b4MPtf1OxNIyY2Oji4WchJ7gXw5VsxXU4YsU01avRhnjksORHFxTEwMCbOaoqHtOfEyxqx0kP+3RFCzZs3yMOPKmRHUq6DTnJlBwcHB4e+88477pZdeOgEWeL0wDCC/wQCW4vuSU6dOVZI1QeFwoGHKpUuXHNdccw1nH2V4hFn9+M6DSZWL90UckNatWzt07xTU72GbDh06VKUtUbTq8e1jwkdAHWPRRi5tLAedrBttNX1HKsIlB2yY7VRQt8jIyFCASAev6KdAfwXbz3ZzDPDc3aNHD/eYMWN8QXReixYtCtFfN8theRw3gMLyWS6ufK7Iejyg5DrjEgRZ8aiZio4B3o/3zdFJTgqj/HB27tyZWmibjz76aPL27dsXb9my5flt27Y9v2PHjkWHDx/+i6heE2qU4rBIzsjIyOZm9aMz5zHBmsmlh0PXhpr8JgqMAzpEEAYz1VheQUHByaNHj24wq2vz5s2thT0Efvjhh32s2on3ajsN7fIlqWPJ/JgoF8zKB3GREAMNeazK0t9fBmh9wStXruyvWABYwCJhsdYku8NMiwBroozvA8rox4T7eLCSzs2bN48UJss4AziJTMUG0T6UoQfqHBPMyuNkfPPNN6db9VOx0Xo52Tdt2hTvpZ0NWh5xHJnfCtH4pIWcRA0HIhoKzTWY7d8qFgCWm4zLJGNeDgypR3ayLWTDtbgytUWKgTIQqnhfMtgiGu/rg2jV8ACNf71ZeY899tgd+KYPZFmh8R04wPeSc1lB4CeffNLnl0A0KLpFQ8uu1QGklq+99tp4swEwQArSaqSh+kbK2RZEVi7ZeTAngDcFR4I/KZpKWBezskDlB8FlupDTQH69Z/YNlM8RivXEvGKIFt5Zd+MRzY61bNkynIOwaNGi30OJTVN8A5pIVyPdJRoHaietBlDUg6LZF1ibHjYr68CBA38D52oLpbHVp59++qDZN+AEy6zqIrV//PHH8Yp/YKhxDOwoup4wyWyAqTGKVq1aVUBtL3z22WeTZ86c+WcYIbYJ70AT6SSkTUo1pU9SGmjZsVtDQnNVwDF8KnfixIlOiI/fm72DkrgPWmspLFCl99133zdg1S7jNxiD30OJjLEqH1quXyxXEJNmyq1fAIQaaCfPne3atWuCaxsMRg8oVP0feuih8bDIbKsHhSsS4bGiHiDZe6MpmpPs2LFjXc3KIdvGBOjAPkrR0hYsfp3Zt1im3GomckjRVqy7vgDRMUpcNlip4+8vikb7p6G8WqZafWc8Fy5cKIfylA/2lUGLzbp1607A2rMAS58J0Fafx/osgaY+YQ+xotqxMUnUA7xRtPABaPKEBWm62bvjx49vwvq1DH2swnq+CvWVYY25y+xbrMvn0oFhfG5nMKkvGJ08qE/4C1B2MPBYa6IaNUwPKLgc9mv3d999Vw7KLkamcFybwES4Ecj7HN8EvPLKK31Hjx49EovyeAs7N2E1JksqOMNu4QVkJy3ZmOKjOJAmz7Fm7yTbLsOtm7Me4qoc7DsB/XNhAtQy1oA9/+qbb76JGTRoUJY0hNSAlcGEBPDGG288bSinpu2sk1eIBgWWxdIff/zxqND1mWMAgrLs57Jlyx7X2sJysQqquWrA98BHBUzWJEjfxIIil024DUOK4bKJ2irubwDy+uI6EGlwQkLCa+i8y4yFoBF7fNW6vRlMvJXD9kqNuQ5wJZGdnf0J2CKXXKshm9eAa60DO/9nWVnZRbM8mACzRV1xYWkwwRqcZuEBSL+WdoS+HCeZ+ulSX0y4blKLrsW6wbmirVg38g3Uld3PUEdN2cQPl8pSPNULODMo2ENpGKGFRiI9Dg3uRVkOY4upAYKQmZnZ2Yc6OKCWiBa+yegAiUi/AOrdK+pyPEsZzQmD950xNu1wvYaDzau0K9S6h9bfEqbKpkptTmW7vOKKSFd2W618/ZUJ3KI18WRUxmq8VyjrjMng0cV4j6j2WLlBFeW0iyclJQVCawxC50LhC46YNm1awr333nsY9nAzxwhnGcu2tOeSbUEcWMphym/UJ2yAAxZIL5TwE4DF3nL69OlOcXFxJ4UX96XaALBNILCAogA/PfCmWX6LpawHip3HKBbs9BS0x4XxLcA37iNHjghwW06uWuwZzxWUSz+EsmHDhtrjzVlFbRJsNt9kIuXZqOlOaUUKx0xrD01vk9lMlBqgnbWpxipkQVleKVqxWTs3BmgS1fffTuv2h2VMeDGYNMYEGkhNFTMgFLPjZyDsJsP76FWrVt0DE+lGNMRIkR7k47NSsJVAzGZTpezMmTMZwgvbJUV707ohTy3fgzICMNCma2euFKRHyRLQ/nCw0sEmz6eDMhaKam7kk+bfGLAbA3+AqgRgXfea2UwipWNmD1dsgu+kM8AUpkyZ0sMHxcArRVspY2yXlcmTSiJYHhF4k5bwW036e6SbqUyZlcE1tdZ3O8uYjvM02ARKhfRKOTUYfchoCPfs2bPXopJLxg/oU4ZnimE2X+LTWUhDdWnWvHnzvsT7uWaFg5r+BU8R/di++FsbDGBrw8yep6en78ESpACUyYAHvZM+SwteoDOfAQPgPJ+blYG2j8UY1Ewy6AHCChpDkeRqRpmtB8YAgLuIBgMnCz1MuG3/0ksv3We1VKovkEKeeuqpEZQtXjxCBNvllbCR0VK/OGuWd9euXY9RQ6UWSls+E9b+YfrEZ7R9P/300/9jVgY5GkyiLYX0innzR/u4nLQcAzuK9mEc7UGyBA5mt6lTp95dT5NnHYBidAKa+Fj6qDmYwgd/dAPX0Q4YeAaY5eNyh+t+IlLWb+n451IHbb2OZlKzsoqLix9SpNJqx7qvsPcqptH+aHZWixTB2vgGyi1YkpbUF+HkBrAovcq1NcrqSuRJo4vXTtohmjqEMJksdn5niI3P5LrVl/DcYKw/25w8eXK5RRv2sq4rqXULL7ZuvG+Um1JjBcoDDzxQCaopYAwWGl05atSojXj+b8jgrrfeemsfrAv7MD6MA6JlZuQjAKIw/dT+/fuTpk+ffgiPy5EKMQNz27dvXwRTapUvDaF8wkCvBPWEaiGvjBfDpMu0ygOZFQBxc4jBgaDgGoQy30cfffQh8pYBQW5vsg39rlq6dGnZnDlz1syfPz+EEanaO3CFSgbwHTx4MAgKaxWQXdC7d+9a7WTcFiZ3hmgESFsCbfLvwXLXSj8GED/llNEjR44UDZXTtTRpRTUBO4LQsaaYWeGoMBzPKL+DcWXnnTIp4vJygwt/KluVuJagYUWQzy4syUqxgK8Uvi1LWGYEBrUNOhjJoDcMHPO5MYiFmFwZubm5anCgvq2YfCHQimNQXwt8T47kkLboCrDiPCCfk6TUWxtIMGg7PXcxKIeUo64StLJkRGUOkFwOeR2JclshT4S4zGXc+LYABo3MvLw8l/AtqrPOGCB/BOZsazkG6mRDezgGLuCDfSloYNm12aHU+iri4+OJrGywxTRQcRooI53aKSrMQcpm6C9DcPmbGixDWPHdJcy8dHh+GBZcVA8kExQohOWM9mQIMZCUzjJJzSg3D0iuMMuECeDB5CgGIhgKTI9bOvOiHRl4lgfEVAjfrFpU6iox0C60geGy6ag7jWUxNhpjUYL2uWlxguJWhjblckxQp5rYTjzPZ5SsaPh6W2F+1J+njQETywaSGQpd7k8PlxGcUsaSqsMY6IfBiJIyM5K/qezQx8vvdBGQ9QapbAVxBUB9QbvahSPxOeWmFr6k5WMMHF5rUaO+gqpVM6/0y6tlyRUJy1MVOtapGxMthTBfIzRutX5xebxD9OXXIyTLtnB/fHfFrUZX4SpchatwFTS4IsFpV6EalOrYuaHil4Fk/UkONSa16jW58Br2YwC6lM4ipcqC9/iQh75v7tqszzEX+no+szlCo16gVIfcclttvLi8JzxW1qfVycHa7GPfakAqT7tleb8IwIcfA00+V/9MjSJRGg8pWHtzE7zpSQnUgjkAPHJBaRwkKfUMPjS0gw6Z3Ur9IMXXOtlPauG1MqekLPjHP/4xCIO/Q/989+7d9/I5LWv8TcvYF198ce/DDz/cE0W14z3W5ruMjcnJydnAfImJiY9YNfj06dNdhIFrO7lMUvwHKUimpyZwqQBr2hLFP7BbqUdoMWzZzRgvpjQOUnyoUzUA6TMlJCQ8w9CrtLS0zfrnjz/++EianWmbpyNo1qxZ3DLUC3aIJUDU63QM4Xc8kH1In+/VV1+dyHxIva121+zYseMGo32cP2IU/0IeDC59TAYhGAaQFxX/QQoR6GXgSWXN5P4xv9QpjwExBc1JpM9w6NAh7iztnJmZ+an+OUzMwxh/R4rOysraTeRhUkzV3oMD7ES+7l999dV87ZnL5TqOZ90Yp468XcEt3jdrJB0wEreXZTRsqaaKGcNYf/jhh0+sOtWmTZvOZtEZgGhYeb48f/58HGzeNXICRg3ujzZd/GdnZyefO3cumbZj/REPrAOGms4WocWxaLt6ZoqNP5dlvYL3vxL+gVhYreifvxFlmm7gN8aiw4pXgeQCImvZ/mGcKQK7VneM4F0YiKPg1KlTB/v06ZMIC99AOHsY2fqzPg8QuwnvCjFppsMitxT+hJ0w7NxvbAP3YAsD6ybWW5jNCnqwZEQGw00HyivDWgfK54Pho/2blR8bz59ValuoQjFz/272bXJy8jtaHfr6kAZNmjRpAneNKBZw4cKFGGGyilCu4NFXGMhXFRPrGyma1kP9t3BWPM4xBoX+U/98/fr1N9IFCYI6x9/gTi8wkhPfdn/iiSdup0fN6NGC73w48+A2D0i+he5YM/bNsoUk5hrKQkZhBvJoiXzM4EzNliyPZ1CPV8AszHnwwQd3bNq0abFZfnwzgzFd2qALGysavTSoI1vaeTXbNY352WvWrDkOJ8YCyLI0s7yY+feYPcfAXocJOU94AcaWbd269YXXX3991vLly2fyHuw53S4Pj66CF2u42TtjjBu5lFU5YMU199CS5yDvoaNHjz6A8fJAqXsTXrWHtegf1Hd80aJFZ+EtHISf0V26dLkdZZdfvHhxs7BrK//AXmx2aoAK8mgJeoIywKIzYd/OpFcI1wxMWhr904mc3/3ud9vNkMBQJMinztW3DjovLNfumGylYNFZsg66/VhPeosWLdLAolh2HpSUDyyydzKeF8Y+YbYPQ70dreokMiEn/wQ2eHL48OF/gKt16aOPPvrqgAEDbtu7d++78K8vEzaAiXinWUAAEOYw6V+d/JK9qkBkYmLS1Su6dev2t5dffnkbxObEFStWXNi3b9/bfH7mzBn62cvfe++9o8uWLbtpyZIl7wBH9KrtNJbNXSE8joNQQ9F28UrIwHjuMsz6EiY8Uq9wEZagYS5o7Dk8eIUb6c3yA3mdGA8uvABP3aEHB2XTtajVU4rBL4acLgSy6THLtsjeDOy7ZsCJZB4yB0Q/Y1UfkQz2tuivf/3r4rZt2zbbtm3bXzAO3ZGnOxSipRikSehbq507dy62KgPteRAUVkcZNI4nvHo9QLkK9JBj2jOIlIuYVBfADdsDWe2hz3wN4pkCbfvf2jcdO3Ychu/yMBHP8jcUrJ1od/m0adNGjRgxYtCUKVNunzt3blOz3aGkLON+MQ5QSzM55EssFGc0ZQZYzk6zMn766aexXFZx8OkNspLRfI7ieKiaWTU8fCaM61GzvBikedLrpIJSHR1qeVwH4a233vozlzRcynAnBLJ1QuoAKu3I0CI+w3r1ix9//HFVamrqFqtyGCkqausHTqOMBhIKqAVTw161atU0nvEyatSomxmvRrnMbyhnZ8+efSuXTO++++4UsOe5jzzyCLfvxGB59XFhYeEBlB0Ltj5aXzbyz+EuDePuUCsZbeuBsvOFclcA2HsllIjuZu8hP9S4ajuuoQG0cmE4XagGMKAeaPB/NHuHQfxC3qqZuU8afbI8AREDd7h79+4tQWX7MQnfBmWWYtBJEUVARiFERzGfYaBnUw4mJSVZWg0ZKWoQG3U6gLIix40bt/nEiRMPoF1l6Evqc889dwsm9ybKZX7DzX5kxSCMCWDPlQcPHjw+derUm/HNZsybCZgshaD2O6GrTNWXjfLuB/LHUczqn5N112oEKZL7gcxmqy9HSyjVOyWeMssv9yS1lX5WXyg61KwOrpUx4033M1MR4W4RmVcdZNYHxWWFYgFcl4KN/geybwqpgZGitGZpsWFsJ6mScWeg6k9ghbrXakMenm+RPnAVyP2YF9ziZ+UXAnIQaOdxQlK0+gcDbOvc8LbvCWveWZhVL5q9BBI2YRKpZ5MRrKiVgAk1EvKoNcNnDK/0tuhaAIo8Cap7kXufhTzVkG0CxQSCikyVMKzVtwwZMuQzILr3b3/72y1ASFH//v15FloV9zVJUE9JhDbvhMb/8uDBg4eCrU6FgvQBKCVcXx5+9wKHCET3GE6lcG81YzMWL148/dprr+1BuwH7xC2tpGYkNWKGIVNofwhSKBSxIFIkI1ig05TxiEeeRybPYAvGMjeYZXM9zjM+mQdjFajlYZnoRyBj2fA8AKLmBFYPhVTGKKdVRPPGinWT5cBkuZyNNFkiaOd5m9q2qUWuXr36U+SvlJvKhB1gMG7A5QbhA9CQAxa3AQhagc7mUmOHzPNowXNQzBxW7dq4ceN7YM8loNQEBhBCXJTD5uw2aV8VNdwnn3zyNOT0IGi5Z7DU2QPkjdZ/REWKg6vlB6KVlStXVkJJOw15m40JECTjzzh5qngoHL734Koe8EOE4erQ4uTwrfod2kjacI4JD+/YPzx8YKuQkLZVUFgjUVFRVdWp9y5d+u67amNLFfOgPG7IqJbJTicNMZUMf+JvvffKFAtENGbRfaKeQI0WgzIVg3May7Ly+fPnK2anCDQUDhw4sPr999//gjsxwDq5/CsHkjVOoEBbdlr1qV+/fgyrdYFaGURYxhMQrPQHsHQGxZbiW56tWYhrK7PvpLWPyS37WoG8uRiHMiILSFRtCKBMTmil+9Dnb/9+55M8J8YB0aGWwXe8H4tK7oqJuSPM4bgpJDziVkf79pGBHdqLqOu7iii8B0LEgIsXxKh9+y4cOXly/m3ff79dK4N1MFgTk68SK4kyKK8qgWkDQRndHOwgU/gBaMrEkuW5t99+m7v6MxkiS7bId5R9UDKewyD8n2gkcHmCNi9HWf+PwdQji4fchYFF7zDZOEiknAc1P48lz/9yTzUG6R0rRPMwXIzNanClrRi8WNxPNfsOrLo5RFyhqBYfBM38GAB9QXCLK88rhSWLMfSOIRPfPF5V6YkKKsn74YJLOae4PUqPNkr07iMFvd9q/nVHR9euQgFi3RABJQcPisrUVBFaWCAiQ0JEZHCwiL7hBhE+ZIgoCQiY0n/8+LXc9qTVwcrJoSWXukzRNJigAY2O+yKCUc7WMWPGfE7uIqoPci0CktXOAxnCbt8wFLpTQMAp43PudmzVqlW8UTaCVV0LZC0B4iiflxrawtBfFxBdpx6yWpS3QpZNLX+1kAhCG2Pp71aqXa2TkOYj8d8rWJ75DR2l0OR4Zy0k2oMx0T93gIMExbsqRcvokOjDp92/4fEUrZoFiaNZblB0sGg6fLhwJSeLoi+/FFXNmovgG28UTQYPFpEdO4hIp1NEtWkrmrgKRcnWreLi5587UZ4abm1sl14UaTJasTKB2p1DDQUknYexQh6mQ/AfBjstQOFllA9gT/mgqiIoStwYoE0ix9mzZ4UVgM3sjY+Pf1vKqurRkudpgt1GQe5NwPvJxnyobx4myVrc5hpeWe+1lcBD2zFRZqCMpZgYVPgOY+C/AnWs/+CDDz6ePHnyAm+6Bbcc0xgifABOdoiVkAvphc6CgmDROTZaXEpzqbQfHhYo0jIrhTszVzQdNkwE33W3KEzcL8p+PipKE74WVRXQ4a5tB5xUighQdVNwisBZs4I6z5tHZNvW61VGczdGp06dFtFqxXOoBU9zl2dlAyGcSdzZwVN2K6j5YsCKGWsNJJfK3R81aztpArVqi2rrRt5csNMqsiAMIB878SwAJj5qxm/BnxsPKja6P6PxDf83xSusjxoMBpPLteMQd8IboM0vk6rQh5UwZPSCOZeRLAJr3qflCcW2gMlOO7TPJyeB2wQOax0h8gvL1WfhTYNEYVEJKLypeu/OzBJF+/ZBGwsVjvh4EX733cIBzhScmSmaoJrouDgR0bq1UE6fFsVbtvgUBlzrBH6zDySP5znU5VT3+ZuTQi7G1Q3iuK/CuwoMVDmD7UePHl1JI4qOkm3r0IDLBG5n5Zkt2lHHfE6tFNwDr0KioP3+C6Kmjp8bbeoDzsROa9q9B8aFn+Pi4uyqpLx2YdK6UPbLqOceGlBAHVHgcCN51jdk9HdoT1+7MrCEPACbvHvGjBmKr0H24Z4SR2jLCHEp0yVaNQ8RHiVIFJVUiTAguglYd+Btt1Wz759+EkXbt4vADh1EeLNoUdWhoyhNT+dZYSIQ/Qzp2NGnCVYzG6BsWC2vuPeHVJaBlE4nA50ZkFkZmvOBuzrAWvPkthlN+623zOdaExRYijVwKW3ctKUzcZsLDBL53CEBQ8des7xAbiwQXXMaH8yhHhj+f6L8NPueIokOC3COkUDUV7L+wZi0HTHhRmkHur/xxhuvPPTQQxMhciz/1QFs5PvZdmjbXrfLUCPnPuoXYpLFnYfXiZFFh0XXnKOiy7nDYlD2ITE6fY9wvfuOKFxNtUFRqTl61iwR3K0b1PMw4cmo3uIVNmqUiPjTn9R7TEyvq5kaikbnTD+QG8jIQ+lk8PDQbwOoCPXXYWsYeFUcGOvgFh8gr4QiwSwflSHYwgMyqgeC/mk31ss5cDuSff9a/y2XfnCUTIc9meegVcE69iXE031A+DpoxAueffbZdjNnzvyQnAuI+RGU7ly3bt1C9PHEoEGDZujLorcJpsxUlOn2Jst1eUTIwIHi9vvvFxUXL4qSY8dElbut8LRoIRRQLhbEIv/rr0XRDz+ANW8VQUAyl1dBsR1FEyiz3MZRdeGiKMZkKPZ4qMUrPstoH6FRmrk3rZtgcxAakUcDRqVF2Q65MU1dr9JAA8RU7Nq1azlszGu074hknnUKaufI5BPRmBBJ8P64wKkG3HXXXdGwTDWH6IikiZTrdHC0SrD4pvyXE+Aoyk033TRTKw825s/oDxaXl1W2wMlAivYUFoq8JUsETF3CA/nrxjq4JCFBlGMSuIFwBzTt8HHjRRC+K09JUZdXxQcOCGdFpVCaNxOBPXqI6JkzhQu6RdXkyT5TtMObw4HytrGbvNhJO2WMwH/0UW0prdserketjpYgYvS/uYaEQlYBxWofzJw1cjYxMfGttWvXHqXrD4YcFzkWFDAnjBVHIZf7YxJc16NHj3vpYIDiR5ZcBOWvGO2iWKoARa+BiLqFR23R8gdT6kYYlMpgHnX7OD4OUrQbMjZ6xgyeRSXKcO8ODVWXeuX5+aIoKUkUJiWLks8/FwrW0wHt2oswyOzwFjECyoOIgILZFBOgFLK7KDNTkfqSbVCHJqMZcGY7K/y0k88rR2BggtWk41ofSzhTmQuEtDPUwf9nQbNtCVjrPCpd9FiNHDlyA5Ccg3oKqAeAOnmqcRnYtur9On78eCren+M9JsA+UDOtS6TYIogG7hTNBTtXI1ZgGp2Cb4tofzZRPM0HQKn2wYaNGyeKsQ7OmTtX5L/4osj7+99F7lNPCdf776ucL3z0HSJq6jQRCOquBOLzn19SlP7oo6fOTJqcfHLixOTsxYuLBJWxgQOFod/WICMk7PzRpicONAS449HOe+XlBKNAxlPRM2OWH+v9UXq/OfvF3Z/0K9O/C+WLZ3W2k37rmv8/Qc8VfLd3sAxGVoIdP0kKlyf16dvDceJyq8uWLVseZwSmuPx/NHwC7Uy1s+PHH8lauFApSExUcpOTlexjx5TUzZuV4ytWKEmzHlf2Dhjg+vD667e9EBv7/O1RURN5wJ08YelmeR28Ki7uyU969hxXn+MgA3mojBWi6XLzx/kZcjLbIlpuUzUFug/pToWsXmvR1n8Z2umQ7sOWWmABES8MR0SwTro5sfJIJHKxahjFs0NZl6irxwTzOZTGWNy3koNcr+25HE8elb28U6e/7OjZc0NC795f7+rZc9vmHj02rOncednU1q3/SGTK4Eue/9lHxnDT399NXnuxDHkChdfjO7R/h8R/KiL2798/Dyy8CRUiyi4urdAhnmPiQOf9sjWWrDkhIWEXZnUJZFwwDRWUMQxcgOz6ht8o1ScQ1MlLCx7yVUFhXj5t2rTzPIJC86hh8Mth1uTB8nFoq3aso6qto04X1sOVNIeCfVNrr6U48d8pwfRaevLkSQYgVELhSoF8/yfaVMGx0R8nwfnUpUuXQmi5LIdHQtdnw7/6/y3p2UJ7imedP78Dk3MP/+kZx1waoDhhaZOowBhU4Fk5Q4ewcqik6xJXDx0otC1g8jImrhwGG58UQUIAD4vhqbPytNj+PEkWz29kKCmpwB8UTdAORecMFdWzVa2L4TP4fY3cymKVndhvKoMMfiVPu63JT7ZrdgqSZOdqQIFFSJS6s4IhO2SrTPLfD+lZvLEdTtGATYqKPN0It5E8GoucgWMsUxz7RvHENnD3jORwQeLysSJa3cRHoLz61g52nkcwkSWRdcnUnleydFmZv1yMAZSJZDlSBmqpjfzXSbYTioPE/Pxe106ma4kctrUBpwM49CcdyGtoo8/1sqkPyanVKSdnGHHAZzIaRzszxu/AQoOlTCPVhegq9ZsfmdQquUOwpG416TrnrS5tRqtHQGhlyGtQAzmP6jhhXu0//mj34sqDuvFQ1nV1G/NVaBz8FykcWMo8u0XpAAAAAElFTkSuQmCC';
    // 'data:application/pdf,base64JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nD2OywoCMQxF9/mKu3YRk7bptDAIDuh+oOAP+AAXgrOZ37etjmSTe3ISIljpDYGwwrKxRwrKGcsNlx1e31mt5UFTIYucMFiqcrlif1ZobP0do6g48eIPKE+ydk6aM0roJG/RegwcNhDr5tChd+z+miTJnWqoT/3oUabOToVmmvEBy5IoCgplbmRzdH0KPj4Kc3RhcnR4cmVmCjEyNzg3CiUlRU9GCg==';

    // const blob = new Blob([base64], {type: 'audio/mp3'}); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'image/png'}); // siempre [ file ] and el type
    const blob = new Blob([base64], { type: 'image/jpeg' }); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'text/html'}); // siempre [ file ] and el type
    // const blob = new Blob([base64], {type: 'application/pdf'}); // siempre [ file ] and el type
    console.log('convertBase64ToBlob blob ', blob);
  }

  async pedirQR() {
    if (this.state.loading) return;
    this.state.loading = true;
    this.setState({ ...this.state });
    venta.Actions.pago_qr(this.key_venta, this.props).then((resp) => {
      console.log("ecito")
      console.log(resp);
      this.state.loading = false;
      this.setState({ ...this.state });

      //limpiar localstorage detalle carrito
      SStorage.removeItem('carritoReducer'); //datos carrito
      //carrito.Actions.removeEvento(obj.key, this.props);

    }).catch((e) => {
      this.state.loading = false;
      this.setState({ ...this.state });
    })
  }

  getQR() {
    if (!this.state.qr) return <SLoad />;
    return <SView col={'xs-12'} height={300} border={'transparent'} center>
      <SImage
        src={"data:image/jpeg;base64,"+this.state.qr}
      />
    </SView>
  }

  findQR(data_orden) {
    if (!data_orden) return null;
    let arr_ordenes = Object.values(data_orden).filter(o => o.type == "QR");
    if (arr_ordenes.length > 0) {
      const order_actual = arr_ordenes[0];
      this.state.qr = order_actual?.data?.image_data;
      return this.state.qr;
    } else {
      this.pedirQR();
      return null;
    }
  }
  render() {
    const data = venta.Actions.getByKey(this.key_venta, this.props);
    const data_orden = orden_pago.Actions.getAll(this.key_venta, this.props);

    if (!data) return <SLoad />;


    return (
      <>
        <SPage center disableScroll>
          <VerificarOrden key_venta={this.key_venta} />

          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SView col={'xs-12'} border={'transparent'}>
                <SText fontSize={14} center>
                  Escanee el código QR a continuación en su aplicación BANCA
                  MÓVIL para completar el pago.
                </SText>
                <SHr height={20} />
                <SView col={'xs-12'} row center>
                  {/* <SText fontSize={14} center>Bs.</SText> */}
                  <SText fontSize={40} center>
                    {' '}
                    {`Bs. ${data.total.toFixed(2)}`}
                    {/* {`total Bs. ${data.total}`} */}
                  </SText>
                </SView>
              </SView>
              <SHr height={20} />
              {this.getQR()}
              <SHr height={40} />
              <SView
                col={'xs-11'}
                row
                center
                height={50}
                border={'transparent'}
                style={{ bottom: 20 }}>
                <SView col={'xs-12'} border={'transparent'} center row>
                  <SView
                    backgroundColor={STheme.color.white}
                    center
                    width={50}
                    height={50}
                    style={{
                      borderWidth: 1,
                      borderColor: STheme.color.primary,
                      borderRadius: 8
                    }}
                    onPress={() => {
                      ImgSaveGallery.guardar(qr);
                    }}>
                    <SIcon
                      name='Descargar'
                      width={30}
                      fill={STheme.color.black}
                    />
                  </SView>
                  <SView width={50} />
                  <SView
                    backgroundColor={STheme.color.white}
                    center
                    width={50}
                    height={50}
                    style={{
                      borderWidth: 1,
                      borderColor: STheme.color.primary,
                      borderRadius: 8
                    }}
                    onPress={() => {
                      ImgShared.compartir(qr);
                    }}>
                    <SIcon
                      name={'Compartir'}
                      width={33}
                      fill={STheme.color.black}
                    />
                  </SView>

                </SView>
              </SView>
              <SHr height={20} />
              <ContadorTiempo key_venta={this.key_venta} />

              <SHr height={20} />
              {/* <SView
                center
                row
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: STheme.color.primary
                }}
                onPress={() => {
                  SNavigation.navigate('billetera/pagoTarjeta', {
                    key_venta: this.key_venta
                  });
                }}>
                <SText fontSize={13}>
                  O cancela por tarjera de crédito/débito
                </SText>
                <SView width={30} height={30} border={this.bgborder} center>
                  <SImage
                    src={require('../../Assets/images/tarjeta1.png')}
                    style={{ width: 25 }}
                  />
                </SView>
                <SView width={30} height={30} border={this.bgborder} center>
                  <SImage
                    src={require('../../Assets/images/tarjeta2.png')}
                    style={{ width: 25 }}
                  />
                </SView>
              </SView> */}
            </SView>
          </SView>
        </SPage>
        {/* <PButtomFooter primary fontSize={24} onPress={() => {
          SNavigation.navigate("carrito/confirmar");
        }}>CONFIRMAR PAGO</PButtomFooter> */}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Qr);
